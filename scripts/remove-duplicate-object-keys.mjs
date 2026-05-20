#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import ts from 'typescript'

const DEFAULT_IGNORED_DIRECTORIES = new Set([
  '.git',
  '.next',
  '.pnpm',
  '.turbo',
  'build',
  'coverage',
  'dist',
  'node_modules',
])

const SUPPORTED_EXTENSIONS = new Set([
  '.cjs',
  '.cts',
  '.js',
  '.jsx',
  '.mjs',
  '.mts',
  '.ts',
  '.tsx',
])

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run') || args.includes('-n')
const targets = args.filter((value) => value !== '--dry-run' && value !== '-n')

if (targets.length === 0) {
  targets.push(process.cwd())
}

const changedFiles = []

for (const target of targets) {
  const resolvedTargets = await expandTarget(target)

  for (const filePath of resolvedTargets) {
    const originalText = await fs.readFile(filePath, 'utf8')
    const sourceFile = ts.createSourceFile(
      filePath,
      originalText,
      ts.ScriptTarget.Latest,
      true,
      scriptKindForFile(filePath),
    )

    const removalRanges = collectRemovalRanges(sourceFile)
    const nextText = applyRanges(originalText, removalRanges)

    if (nextText === originalText) {
      continue
    }

    changedFiles.push(filePath)

    if (!dryRun) {
      await fs.writeFile(filePath, nextText, 'utf8')
    }
  }
}

if (dryRun) {
  if (changedFiles.length === 0) {
    console.log('No duplicate object keys found.')
  } else {
    console.log(`Would update ${changedFiles.length} file(s):`)
    for (const filePath of changedFiles) {
      console.log(`- ${path.relative(process.cwd(), filePath)}`)
    }
  }
} else {
  if (changedFiles.length === 0) {
    console.log('No duplicate object keys found.')
  } else {
    console.log(`Updated ${changedFiles.length} file(s):`)
    for (const filePath of changedFiles) {
      console.log(`- ${path.relative(process.cwd(), filePath)}`)
    }
  }
}

async function expandTarget(target) {
  const absoluteTarget = path.resolve(target)
  const stats = await fs.stat(absoluteTarget).catch(() => null)

  if (!stats) {
    return []
  }

  if (stats.isDirectory()) {
    return collectFiles(absoluteTarget)
  }

  return SUPPORTED_EXTENSIONS.has(path.extname(absoluteTarget)) ? [absoluteTarget] : []
}

async function collectFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      if (DEFAULT_IGNORED_DIRECTORIES.has(entry.name)) {
        continue
      }

      files.push(...await collectFiles(entryPath))
      continue
    }

    if (entry.isFile() && SUPPORTED_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(entryPath)
    }
  }

  return files
}

function scriptKindForFile(filePath) {
  switch (path.extname(filePath)) {
    case '.cts':
    case '.mts':
    case '.ts':
      return ts.ScriptKind.TS
    case '.tsx':
      return ts.ScriptKind.TSX
    case '.cjs':
    case '.js':
    case '.mjs':
      return ts.ScriptKind.JS
    case '.jsx':
      return ts.ScriptKind.JSX
    default:
      return ts.ScriptKind.Unknown
  }
}

function collectRemovalRanges(sourceFile) {
  const ranges = []

  const visit = (node) => {
    if (ts.isObjectLiteralExpression(node)) {
      ranges.push(...getDuplicateMemberRemovalRanges(node, sourceFile))
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)

  return normalizeRanges(ranges)
}

function getDuplicateMemberRemovalRanges(objectLiteral, sourceFile) {
  const groups = new Map()

  objectLiteral.properties.forEach((member, index) => {
    const memberInfo = getMemberInfo(member)

    if (memberInfo === null) {
      return
    }

    const group = groups.get(memberInfo.key) ?? []
    group.push({
      index,
      kind: memberInfo.kind,
    })
    groups.set(memberInfo.key, group)
  })

  const removalRanges = []

  for (const members of groups.values()) {
    const hasValueMember = members.some((member) => member.kind === 'value')

    if (hasValueMember) {
      const lastMember = members[members.length - 1]

      for (const member of members) {
        if (member !== lastMember) {
          removalRanges.push(createMemberRemovalRange(objectLiteral, member.index, sourceFile))
        }
      }

      continue
    }

    let lastGetMember = null
    let lastSetMember = null

    for (const member of members) {
      if (member.kind === 'get') {
        lastGetMember = member
      } else if (member.kind === 'set') {
        lastSetMember = member
      }
    }

    for (const member of members) {
      if (member.kind === 'get' && member !== lastGetMember) {
        removalRanges.push(createMemberRemovalRange(objectLiteral, member.index, sourceFile))
      }

      if (member.kind === 'set' && member !== lastSetMember) {
        removalRanges.push(createMemberRemovalRange(objectLiteral, member.index, sourceFile))
      }
    }
  }

  return removalRanges
}

function createMemberRemovalRange(objectLiteral, memberIndex, sourceFile) {
  const member = objectLiteral.properties[memberIndex]
  const nextMember = objectLiteral.properties[memberIndex + 1]

  return {
    end: nextMember ? nextMember.getFullStart() : member.getEnd(),
    start: member.getFullStart(),
  }
}

function normalizeRanges(ranges) {
  const sortedRanges = ranges
    .filter((range) => range.start < range.end)
    .sort((left, right) => left.start - right.start || right.end - left.end)

  const keptRanges = []

  for (const range of sortedRanges) {
    const isContained = keptRanges.some(
      (candidate) => candidate.start <= range.start && candidate.end >= range.end,
    )

    if (!isContained) {
      keptRanges.push(range)
    }
  }

  return keptRanges.sort((left, right) => right.start - left.start || right.end - left.end)
}

function applyRanges(text, ranges) {
  let nextText = text

  for (const range of ranges) {
    nextText = nextText.slice(0, range.start) + nextText.slice(range.end)
  }

  return nextText
}

function getMemberInfo(member) {
  if (ts.isSpreadAssignment(member)) {
    return null
  }

  if (
    ts.isPropertyAssignment(member) ||
    ts.isShorthandPropertyAssignment(member) ||
    ts.isMethodDeclaration(member)
  ) {
    const key = getPropertyKeyText(member.name)

    return key === null
      ? null
      : {
          key,
          kind: 'value',
        }
  }

  if (ts.isGetAccessorDeclaration(member) || ts.isSetAccessorDeclaration(member)) {
    const key = getPropertyKeyText(member.name)

    if (key === null) {
      return null
    }

    return {
      key,
      kind: ts.isGetAccessorDeclaration(member) ? 'get' : 'set',
    }
  }

  return null
}

function getPropertyKeyText(name) {
  if (ts.isIdentifier(name)) {
    return name.text
  }

  if (ts.isStringLiteralLike(name)) {
    return name.text
  }

  if (ts.isNumericLiteral(name)) {
    return String(Number(name.text))
  }

  if (ts.isComputedPropertyName(name)) {
    const expression = name.expression

    if (ts.isStringLiteralLike(expression)) {
      return expression.text
    }

    if (ts.isNumericLiteral(expression)) {
      return String(Number(expression.text))
    }
  }

  return null
}