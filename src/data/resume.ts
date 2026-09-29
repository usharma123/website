export const PROFILE = {
  name: 'Utsav Sharma',
  headline:
    "Senior Associate – Software Engineer @ CLS · Master's Student at UPenn",
  location: 'Philadelphia, Pennsylvania',
  bio: 'I just like doing things.',
  email: 'utsavsharma124@gmail.com',
  github: 'https://github.com/usharma123',
  linkedin: 'https://www.linkedin.com/in/usharma124/',
} as const

export const EDUCATION: {
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  location: string
}[] = [
  {
    school: 'University of Pennsylvania',
    degree: "Master's degree",
    field: 'Computer Science and Information Technology',
    startDate: '2025',
    endDate: '2026',
    location: 'Philadelphia, PA',
  },
  {
    school: 'University of Florida',
    degree: 'Bachelor of Science',
    field: 'Biochemistry',
    startDate: '2021',
    endDate: '2025',
    location: 'Gainesville, FL',
  },
]
