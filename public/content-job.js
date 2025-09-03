var ye=Object.defineProperty;var be=(w,v,C)=>v in w?ye(w,v,{enumerable:!0,configurable:!0,writable:!0,value:C}):w[v]=C;var L=(w,v,C)=>be(w,typeof v!="symbol"?v+"":v,C);(function(){"use strict";function w(){const t=window.location.href.toLowerCase(),e=window.location.pathname.toLowerCase(),o=window.location.hostname.toLowerCase();return o.includes("linkedin.com")?v(t,e):o.includes("indeed.com")?C(t,e):o.includes("glassdoor.com")?P(t,e):o.includes("naukri.com")?M(t,e):o.includes("ziprecruiter.com")?B(t,e):N(t,e)}function v(t,e){return e.includes("/jobs/view/")||t.includes("/jobs/view/")||e.includes("/jobs/search/")||t.includes("/jobs/search/")||e.includes("/jobs/collections/")||e.includes("/company/")&&e.includes("/jobs")?!0:e==="/jobs/"||e==="/jobs"?document.querySelector(".jobs-search-results, .job-card, .jobs-search__results-list")!==null:!1}function C(t,e){return!!(e.includes("/viewjob")||t.includes("jk=")||e.includes("/jobs")&&(t.includes("q=")||t.includes("l="))||e.includes("/cmp/")&&e.includes("/jobs"))}function P(t,e){return console.log("Glassdoor check - URL:",t,"Pathname:",e),e.includes("/job-listing/")?(console.log("Glassdoor: Individual job listing detected"),!0):e.includes("/Job/index.htm")||e.includes("/job/jobs.htm")?(console.log("Glassdoor: Job index page detected"),!0):e.includes("/Job/")&&e.length>5?(console.log("Glassdoor: Job section detected"),!0):e.includes("/jobs/")?(console.log("Glassdoor: Company jobs section detected"),!0):e.includes("/overview.htm")&&t.includes("filter.jobType")?(console.log("Glassdoor: Company overview with job filter detected"),!0):e.includes("/Jobs/")||t.includes("glassdoor")&&t.includes("job")?(console.log("Glassdoor: Job search with parameters detected"),!0):(e.includes("/Job/")||e.includes("/job/"))&&document.querySelector([".jobResult",".job-search-card",".react-job-listing",'[data-test="job-title"]',".jobTitle",".job-listing"].join(","))?(console.log("Glassdoor: Job content detected on page"),!0):(console.log("Glassdoor: No job page pattern matched"),!1)}function M(t,e){return!!(e.includes("/job-listings-")||e.includes("/jobs-")||e.includes("/jobs-in-")||t.includes("qp=")||t.includes("experience=")||e.includes("/company/")&&e.includes("/jobs"))}function B(t,e){return!!(e.includes("/jobs/")&&e.length>10||e.includes("/candidate/search")||t.includes("search="))}function N(t,e){const i=["/job/","/jobs/","/career","/careers","/apply","/application","/position","/vacancy","/opening","/hiring","/recruitment","/job-listing","/job_listing","/employment","/opportunities"].some(l=>e.includes(l));if(!i)return!1;const n=document.title.toLowerCase(),s=document.body?document.body.innerText.toLowerCase():"",c=["apply now","job description","apply for this job","submit application","job requirements","job responsibilities","position overview","role description","employment type","salary range"].some(l=>s.includes(l)||n.includes(l)),d=["job","position","career","opening","opportunity","employment","vacancy","hiring","recruitment","apply"].some(l=>n.includes(l));return i&&(c||d)}function H(t){var e,o,i,n,s,a,c,r,d,l,u;try{const h=[".job-details-jobs-unified-top-card__job-title",".t-24.t-bold.inline h1",".topcard__title",".jobs-unified-top-card__job-title","h1.t-24"];for(const y of h){const m=document.querySelectorAll(y);if(m&&m.length>0){for(const b of m){const p=(e=b.textContent)==null?void 0:e.trim();if(p){t.title=p;break}}if(t.title!=="Unknown Position")break}}const g=[".job-details-jobs-unified-top-card__company-name a",".job-details-jobs-unified-top-card__company-name",".topcard__org-name-link",".jobs-unified-top-card__company-name",'a[data-tracking-control-name="public_jobs_topcard_company-name"]'];for(const y of g){const m=document.querySelectorAll(y);if(m&&m.length>0){for(const b of m){const p=(o=b.textContent)==null?void 0:o.trim();if(p){t.company=p;break}}if(t.company!=="Unknown Company")break}}const f=[".job-details-jobs-unified-top-card__bullet",".job-details-jobs-unified-top-card__primary-description-container .tvm__text:first-child",".topcard__flavor--bullet",".jobs-unified-top-card__bullet",".job-details-jobs-unified-top-card__workplace-type"];for(const y of f){const m=document.querySelectorAll(y);if(m&&m.length>0){for(const b of m){const p=(i=b.textContent)==null?void 0:i.trim();if(p&&!p.includes("employees")&&!p.includes("followers")&&!p.includes("applicants")){t.location=p;break}}if(t.location!=="Unknown Location")break}}const E=[".job-details-jobs-unified-top-card__workplace-type",".jobs-unified-top-card__workplace-type",".job-details-preferences-and-skills__pill",'.job-criteria__item [data-test-job-criteria-label="Working pattern"]',".job-details-fit-level-preferences"];for(const y of E){const m=document.querySelectorAll(y);if(m&&m.length>0)for(const b of m){const p=(n=b.textContent)==null?void 0:n.trim(),x=k=>{t.jobType?t.jobType+=`, ${k}`:t.jobType=k};p&&(t.jobType="",/remote|work from home|wfh/i.test(p)&&x("Remote"),/hybrid/i.test(p)&&x("Hybrid"),/on-?site|in-?office/i.test(p)&&x("On-site"),/full-?time/i.test(p)&&x("Full-time"),/part-?time/i.test(p)&&x("Part-time"),/contract/i.test(p)&&x("Contract"),/intern|internship/i.test(p)&&x("Internship"),/temporary/i.test(p)&&x("Temporary"))}}const S=document.querySelectorAll(".description__job-criteria-item, .job-criteria__item");for(const y of S){if(!y)continue;const m=y.querySelector(".description__job-criteria-subheader, .job-criteria__subheader"),b=y.querySelector(".description__job-criteria-text, .job-criteria__text");if(m&&b){const p=((s=m.textContent)==null?void 0:s.trim().toLowerCase())||"",x=((a=b.textContent)==null?void 0:a.trim())||"";if(p.includes("experience")||p.includes("seniority")){t.experienceLevel=x;break}}}const T=document.querySelector(".jobs-description__content, #job-details");if(T){const y=T.textContent||"";console.log("Job Description Text:",y);const m=[/\b(?:entry[- ]level|fresher|fresh graduate)\b/i,/\bno experience\b/i,/\b0[- ]?(?:year|yr)[s]? experience\b/i,/\b(?:1|one)[- ]?(?:year|yr)[s]? experience\b/i,/\b(?:2|two)[- ]?(?:year|yr)[s]? experience\b/i,/\b(?:3|three)[- ]?(?:year|yr)[s]? experience\b/i,/\b(?:4|four)[- ]?(?:year|yr)[s]? experience\b/i,/\b(?:5|five)[- ]?(?:year|yr)[s]? experience\b/i,/\b(?:1|one)[- ]?(?:to|–|-)[- ]?(?:2|two)[- ]?(?:year|yr)[s]? experience\b/i,/\b(?:2|two)[- ]?(?:to|–|-)[- ]?(?:3|three)[- ]?(?:year|yr)[s]? experience\b/i,/\b(?:3|three)[- ]?(?:to|–|-)[- ]?(?:5|five)[- ]?(?:year|yr)[s]? experience\b/i,/\b(?:5|five)[- ]?(?:to|–|-)[- ]?(?:8|eight)[- ]?(?:year|yr)[s]? experience\b/i,/\b(?:8|eight)[- ]?(?:to|–|-)[- ]?(?:10|ten)[- ]?(?:year|yr)[s]? experience\b/i,/\b(?:10|ten)\+[- ]?(?:year|yr)[s]? experience\b/i,/\bjunior\b/i,/\bmid[- ]level\b/i,/\bsenior\b/i,/\bprincipal\b/i,/\blead\b/i];for(const b of m){const p=y.match(b);if(p){t.experienceLevel=p[0].trim();break}}}const xe=['.job-details-jobs-unified-top-card__job-insight span:contains("$"), .job-details-jobs-unified-top-card__job-insight span:contains("₹")',".compensation, .salary",".job-details-jobs-unified-top-card__salary-info"];let j=!1;for(const y of S){if(!y)continue;const m=y.querySelector(".description__job-criteria-subheader, .job-criteria__subheader"),b=y.querySelector(".description__job-criteria-text, .job-criteria__text");if(m&&b){const p=((c=m.textContent)==null?void 0:c.trim().toLowerCase())||"",x=((r=b.textContent)==null?void 0:r.trim())||"";if(p.includes("salary")||p.includes("compensation")||p.includes("pay")){t.salary=x,j=!0;break}}}if(!j){const y=document.querySelectorAll(".job-details-jobs-unified-top-card__job-insight, .salary-top-card__salary-range");for(const m of y){if(!m)continue;const b=((d=m.textContent)==null?void 0:d.trim())||"";if(b.includes("$")||b.includes("₹")||b.includes("€")||b.includes("£")||b.includes("¥")||b.includes("salary")||b.includes("compensation")||b.includes("/yr")||b.includes("/hour")||b.includes("per year")||b.includes("per hour")){t.salary=b,j=!0;break}}}if(!j){const y=document.querySelector(".job-details-fit-level-preferences");if(y){const m=y.innerText.split(`
`).map(x=>x.trim()).filter(Boolean),b=["$","₹","€","£","¥","salary","compensation","/yr","/hour","per year","per hour"],p=m.find(x=>b.some(k=>x.toLowerCase().includes(k)));p&&(t.salary=p,j=!0)}}if(!j){const y=document.querySelector(".jobs-description__content, #job-details");if(y){const m=y.textContent||"",b=[/\$\s*[\d,]+\s*-\s*\$\s*[\d,]+\s*(?:per\s+year|per\s+annum|\/year|\/yr|a\s+year|annually)/i,/\$\s*[\d,]+\s*(?:per\s+year|per\s+annum|\/year|\/yr|a\s+year|annually)/i,/₹\s*[\d,]+\s*-\s*₹\s*[\d,]+\s*(?:per\s+year|per\s+annum|\/year|\/yr|a\s+year|annually)/i,/₹\s*[\d,]+\s*(?:per\s+year|per\s+annum|\/year|\/yr|a\s+year|annually)/i,/₹\s*[\d,\.]+\s*(?:lakh|lakhs|lpa)/i,/₹\s*[\d,\.]+\s*-\s*₹\s*[\d,\.]+\s*(?:lakh|lakhs|lpa)/i,/(?:[\d,\.]+|[\d,\.]+\s*-\s*[\d,\.]+)\s*(?:lakh|lakhs|lpa)/i,/salary\s*:\s*[\$₹€£¥]\s*[\d,]+\s*-\s*[\$₹€£¥]\s*[\d,]+/i,/compensation\s*:\s*[\$₹€£¥]\s*[\d,]+\s*-\s*[\$₹€£¥]\s*[\d,]+/i,/salary\s*[\$₹€£¥]\s*[\d,]+\s*-\s*[\$₹€£¥]\s*[\d,]+/i,/[\$₹€£¥]\s*[\d,]+\s*-\s*[\$₹€£¥]\s*[\d,]+\s*(?:per\s+month|monthly|\/month|\/mo|a\s+month)/i,/[\$₹€£¥]\s*[\d,]+\s*(?:per\s+month|monthly|\/month|\/mo|a\s+month)/i];for(const p of b){const x=m.match(p);if(x){t.salary=x[0].trim();const k=x[0].trim();k.length<50&&(t.salary=k);break}}t.salary||(t.salary="Not disclosed")}}const me=document.querySelectorAll(".jobs-company__inline-information");for(const y of me){if(!y)continue;const m=((l=y.textContent)==null?void 0:l.trim())||"";if(m.includes("employee")){t.companySize=m;break}}const fe=document.querySelectorAll(".t-14.mt5");for(const y of fe){if(!y)continue;const m=((u=y.textContent)==null?void 0:u.trim())||"";t.industry=m.split(`
`)[0].trim();break}return t}catch(h){return console.error("Error in LinkedIn extraction:",h),t}}function R(t){try{const e=["h1.jobsearch-JobInfoHeader-title",'h2[data-testid="jobsearch-JobInfoHeader-title"]',".jobsearch-JobInfoHeader-title",'h1[data-testid="jobTitle"]',"h1.icl-u-xs-mb--xs",'h1[data-testid="simpler-jobTitle"]',".css-dpa6rd.e1tiznh50",'[data-testid="jobTitle-editJob"]'];for(const n of e){const s=document.querySelector(n);if(s&&s.textContent.trim()){t.title=s.textContent.trim();break}}const o=['.jobsearch-InlineCompanyRating div[data-testid="company-name"]',".jobsearch-DesktopStickyContainer .jobsearch-JobInfoHeader-companyName",".jobsearch-DesktopStickyContainer .jobsearch-JobInfoHeader-companyNameSimple",".jobsearch-JobInfoHeader-companyName",".css-88a4u1.e1wnkr790",'[data-testid="company-name"]',".css-1h7lukg.eu4oa1w0",".companyName"];for(const n of o){const s=document.querySelector(n);if(s&&s.textContent.trim()){t.company=s.textContent.trim();break}}const i=[".jobsearch-JobInfoHeader-companyLocation",'[data-testid="jobsearch-JobInfoHeader-companyLocation"]','.jobsearch-JobMetadataHeader-iconLabel[data-testid="location"]',".companyLocation",".css-5qwe7c.eu4oa1w0",".css-xb6x8x.e37uo190",'.jobDetails .data-testid="location"',".css-1restlb.eu4oa1w0"];for(const n of i){const s=document.querySelector(n);if(s&&s.textContent.trim()){t.location=s.textContent.trim();break}}return t.salary=O(),t.jobType=F(),t.experienceLevel=G(),t}catch(e){return console.error("Error in Indeed job extraction:",e),t}}function O(){try{const t=[".jobsearch-JobMetadataHeader-item .salary-snippet-container",".salary-snippet-container",".css-18z4q2i.eu4oa1w0",'div[data-testid="attribute_snippet_testid"]:contains("₹")','div[data-testid="attribute_snippet_testid"]:contains("$")','div[data-testid="attribute_snippet_testid"]:contains("€")',"#jobDetailsSection","#salaryInfoAndJobType",'.jobsearch-JobDescriptionSection-sectionItem div:contains("Salary")',".metadata.salary-snippet-container",'[itemprop="baseSalary"]',".css-5zy3wn",'[data-testid="jobsearch-JobMetadataHeader"]'];for(const n of t){let s;try{if(n.includes(":contains(")){const a=n.split(":contains(")[0],c=n.split(":contains(")[1].slice(0,-1);s=Array.from(document.querySelectorAll(a)).filter(r=>r.textContent.includes(c))}else s=document.querySelectorAll(n);for(const a of s){const c=a.textContent.trim();if(c&&A(c))return c}}catch{continue}}const e=document.querySelectorAll(".jobsearch-JobMetadataHeader-item");for(const n of e){const s=n.textContent.trim();if(A(s))return s}const o=document.querySelectorAll("div");for(const n of o){const s=n.textContent.trim();if(U(s))return s}const i=document.querySelector("#jobDescriptionText, .jobsearch-jobDescriptionText");if(i){const n=i.textContent,s=[/(?:salary|compensation|pay)\s*:?\s*[$₹€£¥]\s*[\d,]+\s*(?:to|-|–|—)\s*[$₹€£¥]?\s*[\d,]+/i,/[$₹€£¥]\s*[\d,]+\s*(?:to|-|–|—)\s*[$₹€£¥]?\s*[\d,]+\s*(?:per\s+year|per\s+month|\/year|\/month|a\s+year|a\s+month|annually)/i,/[$₹€£¥]\s*[\d,.]+k\s*(?:to|-|–|—)\s*[$₹€£¥]?\s*[\d,.]+k/i,/[\d,.]+\s*(?:to|-|–|—)\s*[\d,.]+\s+lpa/i,/[\d,.]+\s+lpa/i];for(const a of s){const c=n.match(a);if(c)return c[0].trim()}}return""}catch(t){return console.error("Error extracting salary from Indeed:",t),""}}function A(t){if(!t||!/\d/.test(t))return!1;if(/[$₹€£¥]\s*\d/.test(t)||/[$₹€£¥][\d,.]+ ?(?:to|-|–|—) ?[$₹€£¥]?[\d,.]+/i.test(t))return!0;const e=["salary","pay","compensation","per year","per month","per annum","annually","a year","a month","hourly","per hour","lpa","lakhs","lac"];for(const o of e)if(t.toLowerCase().includes(o)&&/\d/.test(t))return!0;return!!(/\d+k(-\d+k)?/i.test(t)||/\d+(\.\d+)?\s*lpa/i.test(t))}function U(t){return t?!!(/[$₹€£¥]\s*\d/.test(t)&&t.length<100||/[$₹€£¥][\d,.]+ ?(?:to|-|–|—) ?[$₹€£¥]?[\d,.]+/i.test(t)&&t.length<100||/salary|compensation/i.test(t)&&(/\d+\s*(?:to|-|–|—)\s*\d+/.test(t)||/\$\s*\d+/.test(t))&&t.length<100):!1}function F(){try{const t=['div[data-testid="attribute_snippet_testid"]',".css-18z4q2i.eu4oa1w0",".jobsearch-JobMetadataHeader-item",'#jobDetailsSection div:contains("Job Type")','#jobDetailsSection div:contains("Employment Type")',".js-match-insights-provider-4r10qm.eu4oa1w0",'[data-testid="job-type-tile"]','[data-testid="list-item"] [data-testid="Full-time-tile"]','[data-testid="list-item"] [data-testid="Part-time-tile"]','[data-testid="list-item"] [data-testid="Contract-tile"]','[data-testid="list-item"] [data-testid="Temporary-tile"]','[data-testid="list-item"] [data-testid="Internship-tile"]','[data-testid="list-item"] [data-testid="Fresher-tile"]'],e=[{keyword:"full-time",type:"Full-time"},{keyword:"part-time",type:"Part-time"},{keyword:"contract",type:"Contract"},{keyword:"temporary",type:"Temporary"},{keyword:"internship",type:"Internship"},{keyword:"fresher",type:"Fresher"},{keyword:"permanent",type:"Permanent"},{keyword:"remote",type:"Remote"},{keyword:"hybrid",type:"Hybrid"},{keyword:"on-site",type:"On-site"},{keyword:"work from home",type:"Remote"},{keyword:"onsite",type:"On-site"}];for(const n of t){let s;try{if(n.includes(":contains(")){const a=n.split(":contains(")[0],c=n.split(":contains(")[1].slice(0,-1);s=Array.from(document.querySelectorAll(a)).filter(r=>r.textContent.includes(c))}else s=document.querySelectorAll(n);for(const a of s){const c=a.textContent.trim().toLowerCase();if(!(c.includes("salary")||c.includes("reviews")||c.length>50)){for(const{keyword:r,type:d}of e)if(c.includes(r))return n.includes("attribute_snippet_testid")||n.includes("css-18z4q2i")||n.includes("JobMetadataHeader-item")?a.textContent.trim():d;if(c.includes("job type")||c.includes("employment type")){const r=c.indexOf(":");if(r!==-1)return c.substring(r+1).trim();const d=a.parentElement?Array.from(a.parentElement.children):[];for(const l of d)if(l!==a){const u=l.textContent.trim();for(const{keyword:h,type:g}of e)if(u.toLowerCase().includes(h))return u}}}}}catch{continue}}const o=document.querySelectorAll('[data-testid$="-tile"]');for(const n of o){const s=n.textContent.trim();for(const{keyword:a,type:c}of e)if(s.toLowerCase().includes(a))return c}const i=document.querySelector("#jobDescriptionText, .jobsearch-jobDescriptionText");if(i){const n=i.textContent.toLowerCase(),s=[];for(const{keyword:r,type:d}of e)n.includes(r)&&s.push(d);const a=/job\s*type\s*:?\s*([^,.;:]+)/i,c=n.match(a);if(c&&c[1]){const r=c[1].trim();for(const{keyword:d,type:l}of e)r.includes(d)&&s.push(l)}if(s.length>0)return[...new Set(s)].join(", ")}return""}catch(t){return console.error("Error extracting job type from Indeed:",t),""}}function G(){try{const t=['[data-testid="jobsearch-JobDescriptionSection-item"] div:contains("Experience")','#jobDetailsSection div:contains("Experience")',".js-match-insights-provider-nyn4vz",'.jobsearch-JobDescriptionSection-sectionItem div:contains("Experience")','[data-testid="experienceLevel-title"]'],e=[{pattern:/entry[- ]level/i,value:"Entry Level"},{pattern:/fresher/i,value:"Fresher"},{pattern:/trainee/i,value:"Trainee"},{pattern:/no experience/i,value:"No Experience Required"},{pattern:/0[- ]years?/i,value:"0 Years Experience"},{pattern:/junior/i,value:"Junior"},{pattern:/mid[- ]level/i,value:"Mid Level"},{pattern:/senior/i,value:"Senior"},{pattern:/lead/i,value:"Lead"},{pattern:/principal/i,value:"Principal"},{pattern:/executive/i,value:"Executive"},{pattern:/director/i,value:"Director"},{pattern:/manager/i,value:"Manager"},{pattern:/(\d+)\+?\s*(?:to|-|–|—)\s*(\d+)\+?\s*years?/i,value:null},{pattern:/(\d+)\+?\s*years?/i,value:null}];for(const n of t){let s;try{if(n.includes(":contains(")){const a=n.split(":contains(")[0],c=n.split(":contains(")[1].slice(0,-1);s=Array.from(document.querySelectorAll(a)).filter(r=>r.textContent.includes(c))}else s=document.querySelectorAll(n);for(const a of s){const c=a.textContent.trim();if(c.includes("Experience")){const r=c.indexOf(":");if(r!==-1){const l=c.substring(r+1).trim();if(l)return l}const d=a.parentElement?Array.from(a.parentElement.children):[];for(const l of d)if(l!==a){const u=l.textContent.trim();for(const{pattern:h,value:g}of e){const f=u.match(h);if(f){if(g===null){if(h.toString().includes("to")){if(f[1]&&f[2])return`${f[1]}-${f[2]} years experience`}else if(f[1])return`${f[1]}${u.includes("+")?"+":""} years experience`}return g||u}}}}for(const{pattern:r,value:d}of e){const l=c.match(r);if(l){if(d===null){if(r.toString().includes("to")){if(l[1]&&l[2])return`${l[1]}-${l[2]} years experience`}else if(l[1])return`${l[1]}${c.includes("+")?"+":""} years experience`}return d||c}}}}catch{continue}}const o=document.querySelectorAll('[data-testid$="-tile"]');for(const n of o){const s=n.textContent.trim();for(const{pattern:a,value:c}of e){const r=s.match(a);if(r){if(c===null){if(a.toString().includes("to")){if(r[1]&&r[2])return`${r[1]}-${r[2]} years experience`}else if(r[1])return`${r[1]}${s.includes("+")?"+":""} years experience`}return c||s}}}const i=document.querySelector("#jobDescriptionText, .jobsearch-jobDescriptionText");if(i){const n=i.textContent,s=[/experience[^.]*required[^.]*/i,/required[^.]*experience[^.]*/i,/experience[^.]*:/i,/work experience[^.]*/i,/qualifications[^.]*:/i];for(const a of s){const c=n.match(a);if(c){const r=c[0];for(const{pattern:d,value:l}of e){const u=r.match(d);if(u){if(l===null){if(d.toString().includes("to")){if(u[1]&&u[2])return`${u[1]}-${u[2]} years experience`}else if(u[1])return`${u[1]}${r.includes("+")?"+":""} years experience`}return l||u[0]}}}}for(const{pattern:a,value:c}of e){const r=n.match(a);if(r){if(c===null){if(a.toString().includes("to")){if(r[1]&&r[2])return`${r[1]}-${r[2]} years experience`}else if(r[1])return`${r[1]}${n.includes("+")?"+":""} years experience`}return c||r[0]}}}return""}catch(t){return console.error("Error extracting experience level from Indeed:",t),""}}function Y(t){var e;try{const o=[".JobDetails_jobTitle__s_j5h",'h1[data-test="job-title"]',".job-title",".css-17x2pwl.e11nt52q6"];for(const r of o){const d=document.querySelector(r);if(d&&d.textContent){t.title=d.textContent.trim();break}}const i=[".EmployerProfile_employerName__Xemli",'div[data-test="employer-name"]',".employer-name",".css-16nw49e.e11nt52q1"];for(const r of i){const d=document.querySelector(r);if(d&&d.textContent){t.company=d.textContent.trim().replace(/(\d+.\d+)\s*★?/,"").trim();break}}const n=[".JobDetails_location__mSg5h",'div[data-test="location"]',".location",".css-1v5ksva.e11nt52q2"];for(const r of n){const d=document.querySelector(r);if(d&&d.textContent){t.location=d.textContent.trim();break}}const s=[".SalaryEstimate_salaryRange__brHFy",".salary-estimate",'.css-1v5ksva.e11nt52q2:contains("$")','.css-1v5ksva.e11nt52q2:contains("₹")'];for(const r of s){let d;if(r.includes(":contains")){const l=r.split(":contains(")[0],u=r.split(":contains(")[1].replace(/['")]/g,"");d=Array.from(document.querySelectorAll(l)).find(g=>{var f;return(f=g.textContent)==null?void 0:f.includes(u)})}else d=document.querySelector(r);if(d&&d.textContent){t.salary=d.textContent.trim();break}}const a=document.querySelector("#JobDescriptionContainer, .jobDescriptionContent"),c=a?(e=a.textContent)==null?void 0:e.toLowerCase():"";if(c){c.includes("full-time")?t.jobType="Full-time":c.includes("part-time")?t.jobType="Part-time":c.includes("contract")?t.jobType="Contract":c.includes("internship")?t.jobType="Internship":c.includes("temporary")&&(t.jobType="Temporary");const r=c.match(/(\d+)\+? years of experience/);r?t.experienceLevel=`${r[1]}+ years`:c.includes("entry level")?t.experienceLevel="Entry Level":c.includes("senior")&&(t.experienceLevel="Senior")}return t}catch(o){return console.error("Error in Glassdoor job extraction:",o),t}}function Z(t){try{const e=document.querySelector(".jd-header-title");e&&e.textContent&&(t.title=e.textContent.trim());const o=document.querySelector(".jd-header-comp-name a");o&&o.textContent&&(t.company=o.textContent.trim());const i=document.querySelector(".loc a");i&&i.textContent&&(t.location=i.textContent.trim());const n=document.querySelector(".salary");n&&n.textContent&&(t.salary=n.textContent.trim());const s=document.querySelector(".exp");s&&s.textContent&&(t.experienceLevel=s.textContent.trim());const a=document.querySelector(".jd-tags");if(a){const c=Array.from(a.querySelectorAll("a.tag")),r=["full-time","part-time","contract","internship","remote","hybrid"],d=c.map(l=>{var u;return(u=l.textContent)==null?void 0:u.toLowerCase().trim()}).filter(l=>l&&r.includes(l));d.length>0&&(t.jobType=d.join(", "))}return t}catch(e){return console.error("Error in Naukri job extraction:",e),t}}function K(t){try{const e=document.querySelector("h1.job_title");e&&e.textContent&&(t.title=e.textContent.trim());const o=document.querySelector("a.company_name");o&&o.textContent&&(t.company=o.textContent.trim());const i=document.querySelector("span.location");i&&i.textContent&&(t.location=i.textContent.trim());const n=document.querySelector("div.job_compensation");return n&&n.textContent&&(t.salary=n.textContent.trim()),document.querySelectorAll("div.job_metadata_row").forEach(a=>{var r,d,l,u,h;const c=(r=a.textContent)==null?void 0:r.toLowerCase();c&&(c.includes("employment type")&&(t.jobType=((l=(d=a.querySelector("span:last-child"))==null?void 0:d.textContent)==null?void 0:l.trim())||""),c.includes("experience")&&(t.experienceLevel=((h=(u=a.querySelector("span:last-child"))==null?void 0:u.textContent)==null?void 0:h.trim())||""))}),t}catch(e){return console.error("Error in ZipRecruiter job extraction:",e),t}}function X(t){try{const e=["h1","h2",'[class*="title"]','[id*="title"]'];t.title=q(e,["job","position"]);const o=['[class*="company"]','[id*="company"]','[class*="business"]','[class*="employer"]'];t.company=q(o,["company","employer"]);const i=['[class*="location"]','[id*="location"]','[class*="city"]','[class*="address"]'];t.location=q(i,["location","city","address"]);const n=document.body.innerText,s=/[$₹€£]\s?\d{1,3}(?:,?\d{3})*(?:\.\d{2})?/g,a=n.match(s);a&&a.length>0&&(t.salary=a[0]);const c=/(full-?time|part-?time|contract|internship|temporary)/i,r=n.match(c);r&&(t.jobType=r[0]);const d=/(\d+)\+?\s?years? of experience/i,l=n.match(d);return l&&(t.experienceLevel=l[0]),t}catch(e){return console.error("Error in generic job extraction:",e),t}}function q(t,e){var o,i;for(const n of t){const s=document.querySelectorAll(n);for(const a of s){const c=(o=a.textContent)==null?void 0:o.trim().toLowerCase();if(c){for(const r of e)if(c.includes(r))return((i=a.textContent)==null?void 0:i.trim())||""}}}if(t.length>0){const n=document.querySelectorAll(t[0]);if(n.length>0&&n[0].textContent)return n[0].textContent.trim()}return""}function W(){const t=window.location.hostname.toLowerCase();let e={title:"Unknown Position",company:"Unknown Company",location:"Unknown Location",url:window.location.href,date:new Date().toLocaleDateString(),salary:"Not specified",jobType:"Not specified",experienceLevel:"Not specified",companySize:"Not specified",industry:"Not specified",notes:"",status:"saved"};try{t.includes("linkedin.com")?e=H(e):t.includes("indeed.com")?e=R(e):t.includes("glassdoor.com")?e=Y(e):t.includes("naukri.com")?e=Z(e):t.includes("ziprecruiter.com")?e=K(e):e=X(e)}catch(o){console.error("Error extracting job info:",o)}return e.title==="Unknown Position"&&(e.title=document.title.split("|")[0].trim()),e}function Q(t){const e={...t};for(const o in e)typeof e[o]=="string"&&(e[o]=e[o].trim());return e.jobType.toLowerCase().includes("remote")&&e.location.toLowerCase().includes("remote")&&(e.location=e.location.replace(/remote/i,"").trim(),e.location.startsWith(",")&&(e.location=e.location.substring(1).trim())),e}function V(t){let e=Q(t);if((!e.title||e.title==="Unknown Position")&&(e.title=document.title.split("|")[0].trim()||"Unknown Position"),!e.company||e.company==="Unknown Company"){const o=document.querySelector('meta[property="og:site_name"]');e.company=o?o.content:"Unknown Company"}return e}const $="siapDipsJOb",_="siapDipsJObModal";function D(t){if(document.getElementById($))return;const e=document.createElement("button");e.id=$;const o=te();e.appendChild(o),Object.assign(e.style,{position:"fixed",bottom:"110px",right:"20px",zIndex:"9999",width:"60px",height:"60px",backgroundColor:"#1a73e8",color:"white",border:"none",borderRadius:"50%",padding:"0",fontSize:"16px",cursor:"pointer",boxShadow:"0 6px 20px rgba(26, 115, 232, 0.3)",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",transform:"scale(1)",backgroundImage:"linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)",outline:"none",userSelect:"none",WebkitUserSelect:"none",MozUserSelect:"none",msUserSelect:"none"}),oe(e),e.addEventListener("mouseenter",()=>{Object.assign(e.style,{transform:"scale(1.1)",boxShadow:"0 8px 25px rgba(26, 115, 232, 0.4)",backgroundImage:"linear-gradient(135deg, #2196f3 0%, #1976d2 100%)"}),e.style.animationPlayState="paused"}),e.addEventListener("mouseleave",()=>{Object.assign(e.style,{transform:"scale(1)",boxShadow:"0 6px 20px rgba(26, 115, 232, 0.3)",backgroundImage:"linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)"}),e.style.animationPlayState="running"}),e.addEventListener("mousedown",()=>{e.style.transform="scale(0.95)"}),e.addEventListener("mouseup",()=>{e.style.transform=e.matches(":hover")?"scale(1.1)":"scale(1)"}),e.addEventListener("click",i=>{ne(e,i),t()}),document.body.appendChild(e)}function ee(){const t=document.getElementById($);t&&t.remove()}function te(){const t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.setAttribute("xmlns","http://www.w3.org/2000/svg"),t.setAttribute("viewBox","0 0 283.46 283.46"),t.setAttribute("width","24"),t.setAttribute("height","24"),Object.assign(t.style,{filter:"drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",transition:"transform 0.2s ease-in-out"});const e=document.createElementNS("http://www.w3.org/2000/svg","path");e.setAttribute("d","m94.86,34.25l1.76,30.39c-8.19-.18-14.5-.15-18.92.09-14.12.82-21.15,6.09-21.11,15.79.05,9.27,7.4,13.87,22.06,13.8,7.22-.04,14.6-1.8,22.13-5.28,4.84-2.29,11.88-6.91,21.12-13.85l22.56-15.31c12.25-8.25,22.41-14.18,30.48-17.78,11.08-4.9,21.96-7.38,32.63-7.43,14.01-.07,25.24,3.65,33.69,11.16,9.42,8.25,14.16,19.55,14.23,33.89.07,14.66-5.16,25.68-15.69,33.06-8.17,5.86-19.04,8.93-32.62,9.21-1.08,0-4.8.02-11.16.05l-3.22-30.22c9.59-.05,16.33-.35,20.21-.91,9.26-1.34,13.88-5.62,13.84-12.84-.04-8.63-6.96-12.9-20.76-12.83-7.76.04-14.92,1.85-21.48,5.44-3.98,2.18-12.52,7.66-25.63,16.46l-22.73,15.63c-21.49,14.87-42.21,22.36-62.15,22.46-11.86.06-21.57-2.43-29.14-7.46-11.25-7.38-16.91-19.75-17-37.11-.08-16.39,5.47-28.7,16.64-36.95,5.91-4.45,12.2-7.28,18.88-8.5,5.38-.89,11.96-1.35,19.72-1.39,3.56-.02,7.44.13,11.65.43Z"),e.setAttribute("stroke","rgba(255, 255, 255, 0.9)"),e.setAttribute("fill","none"),e.setAttribute("stroke-width","12"),e.setAttribute("stroke-linecap","round"),e.setAttribute("stroke-linejoin","round");const o=document.createElementNS("http://www.w3.org/2000/svg","path");return o.setAttribute("d","m252.41,161.34l.16,32.99c1.47,35.68-15.37,53.92-50.51,54.74l-119.17.58c-35.15-.48-52.16-18.56-51.04-54.25l-.16-32.99,220.72-1.07Zm-191.95,31.82l.02,3.88c.04,9.06,2.07,15.14,6.07,18.24,3.03,2.25,8.42,3.41,16.19,3.48l119.17-.58c8.84-.15,14.81-2.01,17.92-5.58,2.68-3.25,4.05-8.7,4.13-16.35l-.02-3.88-163.48.79Z"),o.setAttribute("stroke","rgba(255, 255, 255, 0.9)"),o.setAttribute("fill","none"),o.setAttribute("stroke-width","12"),o.setAttribute("stroke-linecap","round"),o.setAttribute("stroke-linejoin","round"),t.appendChild(e),t.appendChild(o),t}function oe(t){const e=`
    @keyframes siap-dips-pulse {
      0% {
        box-shadow: 0 6px 20px rgba(26, 115, 232, 0.3);
      }
      50% {
        box-shadow: 0 6px 20px rgba(26, 115, 232, 0.5);
      }
      100% {
        box-shadow: 0 6px 20px rgba(26, 115, 232, 0.3);
      }
    }
  `,o=document.createElement("style");o.textContent=e,document.head.appendChild(o),t.style.animation="siap-dips-pulse 2s ease-in-out infinite"}function ne(t,e){const o=t.getBoundingClientRect(),i=Math.max(o.width,o.height),n=e.clientX-o.left-i/2,s=e.clientY-o.top-i/2,a=document.createElement("span");Object.assign(a.style,{position:"absolute",width:`${i}px`,height:`${i}px`,left:`${n}px`,top:`${s}px`,backgroundColor:"rgba(255, 255, 255, 0.6)",borderRadius:"50%",transform:"scale(0)",animation:"siap-dips-ripple 0.6s ease-out",pointerEvents:"none"});const c=`
    @keyframes siap-dips-ripple {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }
  `,r=document.createElement("style");r.textContent=c,document.head.appendChild(r),t.style.position="fixed",t.style.overflow="hidden",t.appendChild(a),setTimeout(()=>{a.remove()},600)}function I(t){const e=document.getElementById(`${_}-backdrop`),o=t.querySelector("div");o&&(o.style.transform="scale(0.7) translateY(-50px)",o.style.opacity="0"),e&&(e.style.opacity="0"),setTimeout(()=>{t.remove(),e==null||e.remove()},300)}function re(){if(document.getElementById("modal-animations"))return;const e=document.createElement("style");e.id="modal-animations",e.textContent=`
    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: scale(0.7) translateY(-50px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    
    @keyframes modalFadeOut {
      from {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      to {
        opacity: 0;
        transform: scale(0.7) translateY(-50px);
      }
    }
    
    @keyframes backdropFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes backdropFadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,document.head.appendChild(e)}function ie(t,e){const o=document.getElementById(_);if(o){I(o);return}const i=document.createElement("div");i.id=`${_}-backdrop`,Object.assign(i.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"100%",backgroundColor:"rgba(0, 0, 0, 0.5)",zIndex:"9999",opacity:"0",transition:"opacity 0.3s ease-in-out",backdropFilter:"blur(2px)"});const n=document.createElement("div");n.id=_,Object.assign(n.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"100%",zIndex:"10000",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",boxSizing:"border-box"});const s=document.createElement("div");Object.assign(s.style,{backgroundColor:"white",borderRadius:"16px",boxShadow:"0 20px 60px rgba(0, 0, 0, 0.3)",width:"100%",maxWidth:"500px",maxHeight:"80vh",overflowY:"auto",transform:"scale(0.7) translateY(-50px)",transition:"all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",opacity:"0",position:"relative"});const a=document.createElement("button");a.innerHTML="×",Object.assign(a.style,{position:"absolute",top:"16px",right:"16px",width:"32px",height:"32px",border:"none",backgroundColor:"transparent",fontSize:"24px",cursor:"pointer",borderRadius:"50%",color:"#666",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s ease",zIndex:"1"}),a.addEventListener("mouseenter",()=>{a.style.backgroundColor="#f5f5f5",a.style.color="#333"}),a.addEventListener("mouseleave",()=>{a.style.backgroundColor="transparent",a.style.color="#666"});const c=document.createElement("div");c.style.padding="24px";let r=`
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
      <div id="logo-container" style="flex-shrink: 0;"></div>
      <h2 style="margin: 0; color: #1a73e8; font-size: 24px; font-weight: 600;">
        Track Job Application
      </h2>
    </div>
    
    <div id="job-tracker-form">
  `;for(const f in t)f!=="status"&&(r+=`
      <div style="margin-bottom: 16px;">
        <label for="${f}" style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">
          ${f.charAt(0).toUpperCase()+f.slice(1)}
        </label>
        <input type="text" id="${f}" name="${f}" value="${t[f]}" 
               style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; 
                      font-size: 14px; transition: border-color 0.2s ease; box-sizing: border-box;
                      outline: none;" 
               onfocus="this.style.borderColor='#1a73e8'; this.style.boxShadow='0 0 0 3px rgba(26, 115, 232, 0.1)'"
               onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">
      </div>
    `);r+=`
    </div>
    <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 32px;">
      <button id="cancel-track" style="
        padding: 12px 24px; 
        border-radius: 8px; 
        border: 2px solid #e5e7eb; 
        background-color: #f9fafb; 
        color: #374151;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
        font-size: 14px;
      ">Cancel</button>
      <button id="save-track" style="
        padding: 12px 24px; 
        border-radius: 8px; 
        border: none; 
        background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
        color: white; 
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(26, 115, 232, 0.3);
      ">Save</button>
    </div>
  `,c.innerHTML=r;const d=c.querySelector("#logo-container");if(d){const f=se();d.appendChild(f)}s.appendChild(a),s.appendChild(c),n.appendChild(s),document.body.appendChild(i),document.body.appendChild(n),re(),requestAnimationFrame(()=>{i.style.opacity="1",s.style.transform="scale(1) translateY(0)",s.style.opacity="1"});const l=document.getElementById("cancel-track"),u=document.getElementById("save-track");l&&(l.addEventListener("mouseenter",()=>{l.style.backgroundColor="#f3f4f6",l.style.borderColor="#d1d5db"}),l.addEventListener("mouseleave",()=>{l.style.backgroundColor="#f9fafb",l.style.borderColor="#e5e7eb"})),u&&(u.addEventListener("mouseenter",()=>{u.style.transform="translateY(-1px)",u.style.boxShadow="0 4px 12px rgba(26, 115, 232, 0.4)"}),u.addEventListener("mouseleave",()=>{u.style.transform="translateY(0)",u.style.boxShadow="0 2px 8px rgba(26, 115, 232, 0.3)"}));const h=()=>I(n);a.addEventListener("click",h),n.addEventListener("click",f=>{f.target===n&&h()});const g=f=>{f.key==="Escape"&&(h(),document.removeEventListener("keydown",g))};document.addEventListener("keydown",g),l==null||l.addEventListener("click",h),u==null||u.addEventListener("click",()=>{const f={...t};document.querySelectorAll("#job-tracker-form input").forEach(S=>{const T=S.name;f[T]=S.value}),e(f),h()})}function se(){const t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.setAttribute("xmlns","http://www.w3.org/2000/svg"),t.setAttribute("viewBox","0 0 283.46 283.46"),t.setAttribute("width","24"),t.setAttribute("height","24"),Object.assign(t.style,{filter:"drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",transition:"transform 0.2s ease-in-out"});const e=document.createElementNS("http://www.w3.org/2000/svg","path");e.setAttribute("d","m94.86,34.25l1.76,30.39c-8.19-.18-14.5-.15-18.92.09-14.12.82-21.15,6.09-21.11,15.79.05,9.27,7.4,13.87,22.06,13.8,7.22-.04,14.6-1.8,22.13-5.28,4.84-2.29,11.88-6.91,21.12-13.85l22.56-15.31c12.25-8.25,22.41-14.18,30.48-17.78,11.08-4.9,21.96-7.38,32.63-7.43,14.01-.07,25.24,3.65,33.69,11.16,9.42,8.25,14.16,19.55,14.23,33.89.07,14.66-5.16,25.68-15.69,33.06-8.17,5.86-19.04,8.93-32.62,9.21-1.08,0-4.8.02-11.16.05l-3.22-30.22c9.59-.05,16.33-.35,20.21-.91,9.26-1.34,13.88-5.62,13.84-12.84-.04-8.63-6.96-12.9-20.76-12.83-7.76.04-14.92,1.85-21.48,5.44-3.98,2.18-12.52,7.66-25.63,16.46l-22.73,15.63c-21.49,14.87-42.21,22.36-62.15,22.46-11.86.06-21.57-2.43-29.14-7.46-11.25-7.38-16.91-19.75-17-37.11-.08-16.39,5.47-28.7,16.64-36.95,5.91-4.45,12.2-7.28,18.88-8.5,5.38-.89,11.96-1.35,19.72-1.39,3.56-.02,7.44.13,11.65.43Z"),e.setAttribute("stroke","#000"),e.setAttribute("fill","none"),e.setAttribute("stroke-width","12"),e.setAttribute("stroke-linecap","round"),e.setAttribute("stroke-linejoin","round");const o=document.createElementNS("http://www.w3.org/2000/svg","path");return o.setAttribute("d","m252.41,161.34l.16,32.99c1.47,35.68-15.37,53.92-50.51,54.74l-119.17.58c-35.15-.48-52.16-18.56-51.04-54.25l-.16-32.99,220.72-1.07Zm-191.95,31.82l.02,3.88c.04,9.06,2.07,15.14,6.07,18.24,3.03,2.25,8.42,3.41,16.19,3.48l119.17-.58c8.84-.15,14.81-2.01,17.92-5.58,2.68-3.25,4.05-8.7,4.13-16.35l-.02-3.88-163.48.79Z"),o.setAttribute("stroke","#000"),o.setAttribute("fill","none"),o.setAttribute("stroke-width","12"),o.setAttribute("stroke-linecap","round"),o.setAttribute("stroke-linejoin","round"),t.appendChild(e),t.appendChild(o),t}let J=window.location.href,z=null;function ce(t){t(),setInterval(()=>{J!==window.location.href&&(J=window.location.href,t())},500),z=new MutationObserver(e=>{e.some(i=>i.addedNodes.length>0||i.removedNodes.length>0)&&t()}),z.observe(document.body,{childList:!0,subtree:!0})}class ae{constructor(){L(this,"toasts");L(this,"id");L(this,"container");this.toasts=new Map,this.id=0,this.container=null,this.initContainer(),this.initStyles()}initContainer(){this.container=document.getElementById("toastContainer"),this.container||(this.container=document.createElement("div"),this.container.id="toastContainer",this.container.className="toast-container",document.body.appendChild(this.container))}initStyles(){if(document.getElementById("toast-sonner-styles"))return;const e=`
      /* Toast Container */
      .toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-width: 400px;
        width: 100%;
        pointer-events: none;
      }

      /* Toast Base Styles */
      .toast {
        background: white;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        border: 1px solid #e5e7eb;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        position: relative;
        overflow: hidden;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .toast.show {
        transform: translateX(0);
        opacity: 1;
      }

      .toast.hide {
        transform: translateX(100%);
        opacity: 0;
      }

      /* Toast Types */
      .toast.success {
        border-left: 4px solid #22c55e;
      }

      .toast.error {
        border-left: 4px solid #ef4444;
      }

      .toast.warning {
        border-left: 4px solid #f59e0b;
      }

      .toast.info {
        border-left: 4px solid #3b82f6;
      }

      .toast.loading {
        border-left: 4px solid #6b7280;
      }

      /* Toast Icon */
      .toast-icon {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .toast-icon svg {
        width: 100%;
        height: 100%;
      }

      /* Loading Spinner */
      .spinner {
        width: 20px;
        height: 20px;
        border: 2px solid #e5e7eb;
        border-top: 2px solid #6b7280;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Toast Content */
      .toast-content {
        flex: 1;
        min-width: 0;
      }

      .toast-title {
        font-weight: 600;
        color: #111827;
        margin-bottom: 4px;
        line-height: 1.4;
        font-size: 14px;
      }

      .toast-description {
        color: #6b7280;
        font-size: 13px;
        line-height: 1.4;
      }

      /* Close Button */
      .toast-close {
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        color: #9ca3af;
        transition: all 0.2s ease;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .toast-close:hover {
        background: #f3f4f6;
        color: #6b7280;
      }

      /* Progress Bar */
      .toast-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: rgba(0, 0, 0, 0.1);
        transform-origin: left;
        transition: transform linear;
        width: 100%;
      }

      .toast.success .toast-progress {
        background: #22c55e;
      }

      .toast.error .toast-progress {
        background: #ef4444;
      }

      .toast.warning .toast-progress {
        background: #f59e0b;
      }

      .toast.info .toast-progress {
        background: #3b82f6;
      }

      /* Action Button */
      .toast-action {
        margin-top: 8px;
        padding: 6px 12px;
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .toast-action:hover {
        background: #e5e7eb;
      }

      /* Responsive */
      @media (max-width: 480px) {
        .toast-container {
          top: 10px;
          right: 10px;
          left: 10px;
          max-width: none;
        }
      }
    `,o=document.createElement("style");o.id="toast-sonner-styles",o.textContent=e,document.head.appendChild(o)}generateId(){return++this.id}getIcon(e){return{success:`<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #22c55e;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>`,error:`<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #ef4444;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>`,warning:`<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #f59e0b;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.132 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
      </svg>`,info:`<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #3b82f6;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>`}[e]||""}create(e,o="",i={}){this.container||this.initContainer();const n=i.id||this.generateId(),s=i.type||"default",a=i.duration!==void 0?i.duration:4e3,c=i.dismissible!==!1;this.toasts.has(n)&&this.remove(n);const r=document.createElement("div");r.className=`toast ${s}`,r.setAttribute("data-id",String(n));let d="";s==="loading"?d='<div class="toast-icon"><div class="spinner"></div></div>':s!=="default"&&(d=`<div class="toast-icon">${this.getIcon(s)}</div>`);const l=c?`<button class="toast-close" data-toast-close="${n}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>`:"",u=i.action?`<button class="toast-action" data-toast-action="${n}">
          ${i.action.label}
        </button>`:"";r.innerHTML=`
      ${d}
      <div class="toast-content">
        <div class="toast-title">${e}</div>
        ${o?`<div class="toast-description">${o}</div>`:""}
        ${u}
      </div>
      ${l}
      ${a>0?'<div class="toast-progress"></div>':""}
    `;const h=r.querySelector(`[data-toast-close="${n}"]`);h&&h.addEventListener("click",()=>this.remove(n));const g=r.querySelector(`[data-toast-action="${n}"]`);if(g&&i.action&&g.addEventListener("click",()=>this.handleAction(n)),this.container.appendChild(r),this.toasts.set(n,{element:r,timeout:null,action:i.action}),setTimeout(()=>{r.classList.add("show")},10),a>0){const f=r.querySelector(".toast-progress");f&&(f.style.transform="scaleX(0)",f.style.transition=`transform ${a}ms linear`);const E=setTimeout(()=>{this.remove(n)},a);this.toasts.get(n).timeout=E}return n}remove(e){const o=this.toasts.get(e);if(!o)return;const{element:i,timeout:n}=o;n&&clearTimeout(n),i.classList.remove("show"),i.classList.add("hide"),setTimeout(()=>{i.parentNode&&i.parentNode.removeChild(i),this.toasts.delete(e)},300)}handleAction(e){var i;const o=this.toasts.get(e);(i=o==null?void 0:o.action)!=null&&i.onClick&&o.action.onClick()}success(e,o,i){return this.create(e,o,{...i,type:"success"})}error(e,o,i){return this.create(e,o,{...i,type:"error"})}warning(e,o,i){return this.create(e,o,{...i,type:"warning"})}info(e,o,i){return this.create(e,o,{...i,type:"info"})}loading(e,o,i){return this.create(e,o,{...i,type:"loading",duration:0})}promise(e,o,i){const n=this.loading(o.loading||"Loading...");return e.then(s=>(this.success(o.success||"Success!","",{...i,id:n}),s)).catch(s=>{throw this.error(o.error||"Error occurred","",{...i,id:n}),s})}default(e,o,i){return this.create(e,o,i)}}const le=new ae;function de(){console.log("Job Tracker Initializing..."),ce(()=>{w()?D(ue):ee()})}async function ue(){try{const t=W(),e=V(t);ie(e,pe)}catch(t){console.error("Error handling track button click:",t)}}function pe(t){console.log("Saving job data to local storage:",t),chrome.storage.local.get("jobs",e=>{const o=e.jobs||[];o.push(t),chrome.storage.local.set({jobs:o},()=>{console.log("Job data saved successfully!"),le.success("Job saved successfully!","Your job has been added to tracking")})})}de()})();
