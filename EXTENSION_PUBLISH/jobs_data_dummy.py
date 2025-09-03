from datetime import datetime, timedelta
import random
import json

# Define expanded job data options
companies = [
    "Veyor",
    "Glints",
    "Braintrust",
    "Google",
    "Meta",
    "Tokopedia",
    "Gojek",
    "Shopee",
    "Traveloka",
    "Ruangguru",
    "Microsoft",
    "Amazon",
    "Apple",
    "Netflix",
    "Uber",
    "Grab",
    "Bukalapak",
    "OVO",
    "Dana",
    "LinkAja",
    "Blibli",
    "JD.ID",
    "Lazada",
    "Zilingo",
    "Koinworks",
    "Kredivo",
    "Akulaku",
    "Flip",
    "Jenius",
    "Halodoc",
    "Alodokter",
    "HonestDocs",
    "SehatQ",
    "Good Doctor",
    "KitaBisa",
    "Zenius",
    "Skill Academy",
    "Codepolitan",
    "Dicoding",
    "Buildwithangga",
    "Sanbercode",
    "Binar Academy",
    "Rakuten",
    "Line",
    "ByteDance",
    "TikTok",
    "Agoda",
    "Tiket.com",
    "Pegipegi",
    "RedDoorz",
    "Airy",
    "Mamikos",
    "99.co",
    "Rumah123",
    "Lamudi",
    "Urbanindo",
]

company_sizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1,000 employees",
    "1,001-5,000 employees",
    "5,001-10,000 employees",
    "10,001+ employees",
    "Not specified",
]

experience_levels = [
    "intern",
    "entry-level",
    "junior",
    "mid-level",
    "senior",
    "lead",
    "principal",
    "Not specified",
]

industries = [
    "Technology, Information and Internet",
    "Financial Services",
    "E-commerce",
    "Education Technology",
    "Healthcare Technology",
    "Transportation Technology",
    "Gaming",
    "Fintech",
    "Media and Entertainment",
    "Real Estate Technology",
    "Food Technology",
    "Travel Technology",
    "Human Resources Services",
    "Marketing and Advertising",
    "Consulting",
    "Not specified",
]

job_types = [
    "Remote",
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Freelance",
    "Remote, Full-time",
    "Remote, Contract",
    "Remote, Part-time",
    "Hybrid",
    "On-site, Full-time",
    "Temporary",
]

locations = [
    "Indonesia",
    "Jakarta, Jakarta, Indonesia",
    "Bandung, West Java, Indonesia",
    "Surabaya, East Java, Indonesia",
    "Yogyakarta, Yogyakarta, Indonesia",
    "Semarang, Central Java, Indonesia",
    "Medan, North Sumatra, Indonesia",
    "Denpasar, Bali, Indonesia",
    "Malang, East Java, Indonesia",
    "Remote",
]

statuses = [
    "saved",
    "applied",
    "phone-screen",
    "interview",
    "technical-test",
    "offer",
    "rejected",
    "withdrawn",
]

titles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Android Developer",
    "iOS Developer",
    "React Developer",
    "Vue.js Developer",
    "Angular Developer",
    "Node.js Developer",
    "Python Developer",
    "Java Developer",
    "Golang Developer",
    ".NET Developer",
    "Data Scientist",
    "Data Engineer",
    "Data Analyst",
    "ML Engineer",
    "AI Engineer",
    "DevOps Engineer",
    "Cloud Engineer",
    "Infrastructure Engineer",
    "Site Reliability Engineer",
    "Product Manager",
    "Technical Product Manager",
    "Project Manager",
    "Scrum Master",
    "UI/UX Designer",
    "Product Designer",
    "Graphic Designer",
    "Motion Designer",
    "QA Engineer",
    "QA Automation Engineer",
    "Test Engineer",
    "Security Engineer",
    "Database Administrator",
    "System Administrator",
    "Network Engineer",
    "Technical Writer",
    "Developer Relations",
    "Solutions Architect",
    "Tech Lead",
    "Engineering Manager",
    "CTO",
    "VP of Engineering",
    "Head of Engineering",
]

notes_samples = [
    "",
    "Followed up via email",
    "Need to update resume",
    "Prepare for technical interview",
    "Great company culture",
    "Competitive salary",
    "Remote work opportunity",
    "Interesting tech stack",
    "Fast-growing startup",
    "Good work-life balance",
    "Applied through referral",
    "Found on company website",
    "Recruiter reached out",
    "Alumni network connection",
    "Met at tech conference",
    "Coding challenge completed",
    "Waiting for feedback",
    "Second interview scheduled",
    "Portfolio review requested",
    "Technical assessment pending",
    "Reference check in progress",
    "Offer negotiation",
]


def generate_salary():
    """Generate realistic salary ranges"""
    if random.random() < 0.3:  # 30% have salary info
        base = random.choice(
            [5000, 8000, 12000, 15000, 20000, 25000, 30000, 50000, 80000]
        )
        variation = random.randint(-2000, 5000)
        salary = max(3000, base + variation)
        return f"${salary:,} per month"
    return "Not specified"


# Generate job applications over the last 2 years with higher frequency
end_date = datetime.now()
start_date = end_date - timedelta(days=730)
date_list = [
    start_date + timedelta(days=x) for x in range((end_date - start_date).days + 1)
]

# Track streaks and active days
active_days = set()
current_streak = 0
max_streak = 0
temp_current_streak = 0
job_data = []

# Create more realistic application patterns with longer streaks
for i, date in enumerate(date_list):
    # Higher probability of applying (70% chance)
    # Create streak patterns - if applied yesterday, higher chance today
    yesterday_applied = i > 0 and (date - timedelta(days=1)).date() in active_days

    if yesterday_applied:
        apply_probability = 0.85  # 85% chance if on a streak
    else:
        apply_probability = 0.65  # 65% base chance

    # Occasional rest days to break streaks
    if temp_current_streak > random.randint(15, 45):  # Break streak after 15-45 days
        apply_probability = 0.1

    if random.random() < apply_probability:
        # Number of jobs applied per day (weighted towards 1-2 jobs)
        jobs_today = random.choices([1, 2, 3, 4, 5], weights=[50, 30, 12, 5, 3])[0]
        active_days.add(date.date())
        temp_current_streak += 1
        max_streak = max(max_streak, temp_current_streak)

        for _ in range(jobs_today):
            # Ensure unique job URLs
            job_id = random.randint(4000000000, 4299999999)

            job_data.append(
                {
                    "company": random.choice(companies),
                    "companySize": random.choice(company_sizes),
                    "date": date.strftime("%m/%d/%Y"),
                    "experienceLevel": random.choice(experience_levels),
                    "industry": random.choice(industries),
                    "jobType": random.choice(job_types),
                    "location": random.choice(locations),
                    "notes": random.choice(notes_samples),
                    "salary": generate_salary(),
                    "status": random.choice(statuses),
                    "title": random.choice(titles),
                    "url": f"https://www.linkedin.com/jobs/collections/recommended/?currentJobId={job_id}",
                }
            )
    else:
        temp_current_streak = 0  # Break streak

# Calculate current streak (from today backwards)
current_streak = 0
for date in reversed(date_list):
    if date.date() in active_days:
        current_streak += 1
    else:
        break

# Sort jobs by date
job_data.sort(key=lambda x: datetime.strptime(x["date"], "%m/%d/%Y"))

print(f"Generated {len(job_data)} job applications")
print(
    f"Active days: {len(active_days)} out of {len(date_list)} days ({len(active_days)/len(date_list)*100:.1f}%)"
)
print(f"Max streak: {max_streak} days")
print(f"Current streak: {current_streak} days")

# Export to JSON file
with open("job_applications.json", "w") as f:
    json.dump(job_data, f, indent=2)

print("Job data saved to job_applications.json")
