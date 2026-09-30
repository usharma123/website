export type ResearchAcceptance = {
  venue: string
  url: string
  status: string
}

export type ResearchProject = {
  title: string
  org: string
  startDate: string
  endDate: string
  description: string
  stack: string[]
  highlight?: string
  acceptances?: ResearchAcceptance[]
}

const RESEARCH: ResearchProject[] = [
  {
    title:
      'Probing Physical Readability Under Temporal Straightening in Visual World Models',
    org: 'NeurIPS 2026 Workshops',
    startDate: 'September 2026',
    endDate: 'September 2026',
    description:
      'Co-authored a paper investigating physical readability under temporal straightening in visual world models.',
    stack: ['world models', 'physical AI', 'temporal straightening'],
    acceptances: [
      {
        venue: 'World Models and Physical AI (WM PAI)',
        url: 'https://www.worldmodels-physicalai.com/cfp.html',
        status: 'Accepted as a poster',
      },
      {
        venue: 'PTA: From Pretrained Representations to Acting Agents',
        url: 'https://ptaworkshop.github.io/call-for-papers.html',
        status: 'Accepted',
      },
    ],
  },
  {
    title: 'Brownian Bridge Diffusion for CT → Synthetic MRI',
    org: 'Dream Team Engineering · Deep Brain Stimulation',
    startDate: 'August 2024',
    endDate: 'May 2025',
    description:
      'Software Lead on a multi-modal Brownian Bridge diffusion model converting brain CT scans into synthetic MRIs for patients contraindicated for MRI imaging. Led model architecture and pipeline development, contributed to imaging protocol design, and optimized performance for medical data.',
    stack: ['PyTorch', 'MONAI', 'diffusion models', 'medical imaging'],
    highlight: 'Presented at the Yale Undergraduate Research Conference',
  },
  {
    title: 'Post-Surgical Range-of-Motion Assessment',
    org: 'Dream Team Engineering · Range of Motion',
    startDate: 'January 2025',
    endDate: 'May 2025',
    description:
      'Computer vision program conducting post-surgery range-of-motion tests for shoulder rehabilitation, with an inverse kinematics algorithm analyzing angular acceleration to calculate forces applied during movement.',
    stack: ['OpenCV', 'MediaPipe', 'inverse kinematics'],
  },
  {
    title: 'SEIRD Disease Spread Modeling',
    org: 'Dream Team Engineering · D.R.I.F.T',
    startDate: 'January 2024',
    endDate: 'May 2025',
    description:
      'Testing and evaluation framework modeling and predicting disease spread, combining spatial analysis with gradient-boosted predictive analytics over large-scale parsed datasets.',
    stack: ['ArcGIS', 'XGBoost', 'epidemiological modeling'],
  },
  {
    title: 'GAN Architectures for CT Dataset Augmentation',
    org: 'Dream Team Engineering · CT GAN',
    startDate: 'January 2024',
    endDate: 'December 2024',
    description:
      'Evaluation frameworks for amplifying CT datasets with COVID-19 data using GANs. Implemented FID, SSIM, and ID metrics to compare WGAN, DCGAN, FLGAN, and PGGAN, selecting the optimal architecture for medical image enhancement.',
    stack: ['GANs', 'FID', 'SSIM', 'medical imaging'],
    highlight: 'Co-authored research paper',
  },
  {
    title: 'Mock Scanners as a Sedation Alternative in Pediatric MRI',
    org: 'Dream Team Engineering · MRI Research',
    startDate: 'May 2024',
    endDate: 'August 2024',
    description:
      'Prospective study using a mock scanner as a non-invasive alternative to sedation for pediatric MRIs — research design, data collection, and analysis aimed at reducing sedation-associated risks and improving MRI accessibility.',
    stack: ['clinical study design', 'data analysis'],
    highlight: 'Co-authored research paper',
  },
  {
    title: 'Berlin Heart Patient Education Model',
    org: 'Dream Team Engineering · Cardiothoracic Research',
    startDate: 'May 2023',
    endDate: 'May 2024',
    description:
      "Led an IRB-approved study assessing a patient education model for Berlin Heart transplant, managing a cross-disciplinary team of six alongside biomedical engineers to design metrics evaluating the model's success.",
    stack: ['IRB', 'clinical research'],
    highlight: 'Published literature review on patient education and SVTs',
  },
]

export default RESEARCH
