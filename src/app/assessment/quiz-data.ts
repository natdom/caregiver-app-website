import type { Question, Stage, Recommendation } from '@/lib/assessment/types'

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'How often does someone rely on you for help?',
    countsForStage: true,
    options: [
      { letter: 'A', text: 'Rarely or not at all right now' },
      { letter: 'B', text: 'Occasionally' },
      { letter: 'C', text: 'Several times a week' },
      { letter: 'D', text: 'Daily' },
      { letter: 'E', text: 'They no longer rely on me the way they once did' },
    ],
  },
  {
    id: 2,
    text: 'When you think about the future, which feeling is strongest?',
    countsForStage: false,
    options: [
      { letter: 'A', text: 'Curiosity' },
      { letter: 'B', text: 'Uncertainty' },
      { letter: 'C', text: 'Responsibility' },
      { letter: 'D', text: 'Exhaustion' },
      { letter: 'E', text: 'Reflection' },
    ],
  },
  {
    id: 3,
    text: 'Who are you supporting?',
    countsForStage: true,
    options: [
      { letter: 'A', text: 'No one currently, but I may in the future' },
      { letter: 'B', text: 'A loved one whose needs are beginning to increase' },
      { letter: 'C', text: 'Someone who regularly needs my support' },
      { letter: 'D', text: 'Someone with significant or complex care needs' },
      { letter: 'E', text: 'I recently cared for someone whose situation has changed or ended' },
    ],
  },
  {
    id: 4,
    text: 'What keeps you up at night?',
    countsForStage: true,
    options: [
      { letter: 'A', text: 'Wondering what may happen in the future' },
      { letter: 'B', text: 'Worrying about making the wrong decisions' },
      { letter: 'C', text: 'Balancing all my responsibilities' },
      { letter: 'D', text: 'Concern about worsening health or care needs' },
      { letter: 'E', text: 'Thinking about life after caregiving' },
    ],
  },
  {
    id: 5,
    text: 'Which statement feels most true today?',
    countsForStage: true,
    options: [
      { letter: 'A', text: "I'm gathering information." },
      { letter: 'B', text: "I'm figuring things out as I go." },
      { letter: 'C', text: "I'm the person everyone turns to." },
      { letter: 'D', text: 'I need more help than I have.' },
      { letter: 'E', text: "I'm adjusting to a new chapter." },
    ],
  },
  {
    id: 6,
    text: 'How confident are you navigating healthcare, community services, or support programs?',
    countsForStage: true,
    options: [
      { letter: 'A', text: "I haven't needed to yet." },
      { letter: 'B', text: 'Not very confident.' },
      { letter: 'C', text: 'Fairly confident.' },
      { letter: 'D', text: "Very confident, but it's becoming overwhelming." },
      { letter: 'E', text: "It's no longer something I manage regularly." },
    ],
  },
  {
    id: 7,
    text: 'Which best describes the support your loved one needs?',
    countsForStage: true,
    options: [
      { letter: 'A', text: 'Mostly future planning.' },
      { letter: 'B', text: 'Occasional assistance.' },
      { letter: 'C', text: 'Appointment coordination, transportation, or regular support.' },
      { letter: 'D', text: 'Daily living, personal care, safety, or medical monitoring.' },
      { letter: 'E', text: 'Care is no longer actively required from me.' },
    ],
  },
  {
    id: 8,
    text: 'How supported do you feel by family or friends?',
    countsForStage: false,
    options: [
      { letter: 'A', text: 'Very supported' },
      { letter: 'B', text: 'Mostly supported' },
      { letter: 'C', text: 'Somewhat supported' },
      { letter: 'D', text: 'Rarely supported' },
      { letter: 'E', text: 'My support needs have changed' },
    ],
  },
  {
    id: 9,
    text: 'How often do you think about caregiving?',
    countsForStage: true,
    options: [
      { letter: 'A', text: 'Occasionally' },
      { letter: 'B', text: 'A few times a week' },
      { letter: 'C', text: 'Most days' },
      { letter: 'D', text: 'Almost constantly' },
      { letter: 'E', text: 'Much less than before' },
    ],
  },
  {
    id: 10,
    text: 'Over the past month, how often have you felt overwhelmed?',
    countsForStage: false,
    options: [
      { letter: 'A', text: 'Never' },
      { letter: 'B', text: 'Occasionally' },
      { letter: 'C', text: 'Sometimes' },
      { letter: 'D', text: 'Frequently' },
      { letter: 'E', text: 'My feelings are more about adjustment than overwhelm' },
    ],
  },
  {
    id: 11,
    text: 'Which role sounds most like you?',
    countsForStage: true,
    options: [
      { letter: 'A', text: 'Planner' },
      { letter: 'B', text: 'Learner' },
      { letter: 'C', text: 'Coordinator' },
      { letter: 'D', text: 'Crisis Manager' },
      { letter: 'E', text: 'Reflector' },
    ],
  },
  {
    id: 12,
    text: 'How easy is it to make time for yourself?',
    countsForStage: false,
    options: [
      { letter: 'A', text: 'Very easy' },
      { letter: 'B', text: 'Fairly easy' },
      { letter: 'C', text: 'Sometimes difficult' },
      { letter: 'D', text: 'Extremely difficult' },
      { letter: 'E', text: "I'm working on rebuilding that time" },
    ],
  },
  {
    id: 13,
    text: 'How organized is your care plan or support system?',
    countsForStage: true,
    options: [
      { letter: 'A', text: "We haven't created one yet." },
      { letter: 'B', text: "It's just beginning to take shape." },
      { letter: 'C', text: 'We have routines and systems.' },
      { letter: 'D', text: 'Our systems are struggling to keep up.' },
      { letter: 'E', text: 'Planning has shifted to new priorities.' },
    ],
  },
  {
    id: 14,
    text: 'How much has caregiving changed your life?',
    countsForStage: true,
    options: [
      { letter: 'A', text: 'Very little so far' },
      { letter: 'B', text: 'A little' },
      { letter: 'C', text: 'Moderately' },
      { letter: 'D', text: 'Significantly' },
      { letter: 'E', text: 'It changed me deeply, but differently now' },
    ],
  },
  {
    id: 15,
    text: 'Which statement describes your current challenge?',
    countsForStage: true,
    options: [
      { letter: 'A', text: 'Knowing what to prepare for' },
      { letter: 'B', text: 'Knowing where to start' },
      { letter: 'C', text: 'Keeping everything organized' },
      { letter: 'D', text: 'Managing increasing complexity' },
      { letter: 'E', text: 'Defining what comes next' },
    ],
  },
  {
    id: 16,
    text: 'If pero could help you with one thing right now, what would it be?',
    countsForStage: true,
    options: [
      { letter: 'A', text: 'A roadmap for the future' },
      { letter: 'B', text: 'Guidance and education' },
      { letter: 'C', text: 'Tools to stay organized' },
      { letter: 'D', text: 'More support and relief' },
      { letter: 'E', text: 'Help navigating my next chapter' },
    ],
  },
]

export const STAGES: Record<string, Stage> = {
  A: {
    letter: 'A',
    displayName: 'Getting Ready',
    internalName: 'Preparing Caregiver',
    season: "Right now, it sounds like you're Getting Ready.",
    description:
      "You're beginning to notice signs that caregiving may become part of your future. This stage is about learning, planning, and having important conversations — before a crisis occurs.",
    strength: {
      headline: 'Thinking Ahead',
      body: "You're already doing something most caregivers wish they'd done sooner. Preparing early gives you and your loved one more choices later.",
    },
    awareness: {
      headline: 'The Uncertainty is Real',
      body: "It can be hard to plan for something that hasn't happened yet. The conversations you start now — even imperfect ones — will make a real difference later.",
    },
    nextStep:
      'Talk to one person in your life about what caregiving might look like. You don\'t need answers — just the conversation.',
    crmTag: 'pero_getting_ready',
  },
  B: {
    letter: 'B',
    displayName: 'Finding Your Footing',
    internalName: 'Emerging Caregiver',
    season: "Right now, it sounds like you're Finding Your Footing.",
    description:
      "You've recently stepped into caregiving and are learning new responsibilities as you go. This stage often feels overwhelming because the learning curve is steep — and you're figuring out things no one prepared you for.",
    strength: {
      headline: 'Showing Up',
      body: "You're learning as you go, and that takes courage most people don't give themselves credit for. Asking questions is one of the most important things a caregiver can do.",
    },
    awareness: {
      headline: 'The Trap of Going It Alone',
      body: "Trying to figure everything out on your own is one of the most common mistakes new caregivers make. Finding even one source of support can shift everything.",
    },
    nextStep:
      'Start a simple care log — even just a notes file on your phone. Capturing what you\'re managing helps you see it more clearly, and makes it easier to share with others.',
    crmTag: 'pero_finding_your_footing',
  },
  C: {
    letter: 'C',
    displayName: 'Holding It All Together',
    internalName: 'Experienced Caregiver',
    season: "Right now, it sounds like you're Holding It All Together.",
    description:
      "Caregiving is now a regular part of your life. You've built routines and accumulated real experience. While you're capable and knowledgeable, maintaining balance and preventing burnout are becoming the central challenge.",
    strength: {
      headline: 'You\'ve Built Real Systems',
      body: "The routines and coordination you've developed take real effort to build. That experience is something newer caregivers desperately need — and something you should protect.",
    },
    awareness: {
      headline: 'The Quiet Erosion',
      body: "The risk for experienced caregivers is burnout that builds so gradually you don't notice it until it's serious. Small signs add up — don't wait for a crisis.",
    },
    nextStep:
      'Identify one task this week that someone else could take over, even temporarily. Delegation is not giving up — it\'s sustainable caregiving.',
    crmTag: 'pero_holding_it_all_together',
  },
  D: {
    letter: 'D',
    displayName: 'Managing Increasing Needs',
    internalName: 'Advanced Caregiver',
    season: "Right now, it sounds like you're Managing Increasing Needs.",
    description:
      "Your loved one's care needs have become more demanding and complex. You may be juggling medical decisions, personal care, safety concerns, and constant coordination. The needs are growing faster than the support.",
    strength: {
      headline: 'Extraordinary Dedication',
      body: "You're doing something remarkable under conditions most people can't imagine. The depth of your commitment to your loved one is real.",
    },
    awareness: {
      headline: 'You Matter Too',
      body: "When care needs grow rapidly, it's easy to lose yourself in the doing. Your wellbeing isn't a luxury — it's what makes sustainable care possible.",
    },
    nextStep:
      'Talk to one healthcare provider or social worker about what additional support might look like. You don\'t have to know what to ask for — just open the door.',
    crmTag: 'pero_managing_increasing_needs',
  },
  E: {
    letter: 'E',
    displayName: 'Finding Your Next Chapter',
    internalName: 'Legacy Caregiver',
    season: "Right now, it sounds like you're Finding Your Next Chapter.",
    description:
      "Your active caregiving role has changed or ended. Whether through a transition to professional care, recovery, or loss — you're navigating what comes after. This stage is about healing, reflection, and rediscovering who you are beyond caregiving.",
    strength: {
      headline: 'Carried Something Heavy',
      body: "You carried something heavy for a long time. The wisdom, perspective, and resilience you developed are real — even when they're hard to see right now.",
    },
    awareness: {
      headline: 'Grief Without a Clear Name',
      body: "Grief after caregiving can be disorienting — especially when the role that defined your days is suddenly gone. There's no standard timeline. What you're feeling is real.",
    },
    nextStep:
      'Give yourself permission to just be for a little while. There\'s no timeline for what comes next, and you don\'t owe anyone a quick recovery.',
    crmTag: 'pero_finding_your_next_chapter',
  },
}

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-parent-role',
    title: 'When a Parent Becomes the One Who Needs You',
    description:
      'A guide for adult children preparing to take on a caregiving role — what to expect and how to start the conversation.',
    href: '/explore/when-parent-becomes-one-who-needs-you',
    type: 'resource',
    reason: 'Because preparing early gives you and your loved one more choices later.',
    stages: ['A', 'B'],
    boostSignals: [],
    relationshipContexts: ['aging_parent'],
  },
  {
    id: 'rec-child-needs',
    title: "When Your Child's Needs Redefine Your Life",
    description:
      'For parents navigating a caregiving role that grew from parenting — understanding what shifted and what actually helps.',
    href: '/explore/when-childs-needs-redefine-your-life',
    type: 'resource',
    reason: 'Because caregiving for a child looks and feels different from other forms of care.',
    stages: ['A', 'B', 'C'],
    boostSignals: [],
    relationshipContexts: ['child'],
  },
  {
    id: 'rec-local-support',
    title: 'Finding Local Support',
    description:
      'A practical guide to locating community resources, services, and networks in your area.',
    href: '/explore/finding-local-support',
    type: 'guide',
    reason: "Because knowing what's available nearby is one of the most useful things you can learn early.",
    stages: ['A', 'B'],
    boostSignals: ['doing_it_without_backup', 'planning_ahead'],
  },
  {
    id: 'rec-care-log',
    title: 'Starting a Care Log',
    description:
      'How to keep track of medications, appointments, and care details without adding to your mental load.',
    href: '/explore/starting-a-care-log',
    type: 'tool',
    reason: "Because capturing what you're managing helps you see it clearly — and share it with others.",
    stages: ['B', 'C'],
    boostSignals: ['natural_care_coordinator'],
  },
  {
    id: 'rec-appointments',
    title: 'Making Medical Appointments Less Stressful',
    description:
      'Practical strategies for preparing for, participating in, and following up after healthcare appointments.',
    href: '/explore/medical-appointments-less-stressful',
    type: 'guide',
    reason: 'Because navigating the healthcare system is often the steepest part of the learning curve.',
    stages: ['B', 'C', 'D'],
    boostSignals: ['natural_care_coordinator'],
  },
  {
    id: 'rec-self-care',
    title: 'Self-Care Strategies That Actually Work',
    description:
      'Realistic approaches to maintaining your own wellbeing while caring for someone else — not the kind that require a spa day.',
    href: '/explore/self-care-strategies',
    type: 'resource',
    reason: 'Because sustainable caregiving requires taking care of yourself too.',
    stages: ['B', 'C', 'D'],
    boostSignals: ['carrying_heavy_load', 'doing_it_without_backup'],
  },
  {
    id: 'rec-stay-connected',
    title: 'Staying Connected When Illness Changes Everything',
    description:
      'How to maintain your relationship with a loved one when the nature of your connection has fundamentally shifted.',
    href: '/explore/stay-connected-when-illness-changes-everything',
    type: 'resource',
    reason: 'Because illness changes relationships — and navigating that takes real intention.',
    stages: ['C', 'D'],
    boostSignals: [],
  },
  {
    id: 'rec-emergency-prep',
    title: 'Emergency Preparedness for Caregivers',
    description:
      'How to create a backup plan so that care continues even when the unexpected happens.',
    href: '/explore/emergency-preparedness',
    type: 'guide',
    reason: "Because having a plan reduces the fear of what happens if you can't be there.",
    stages: ['C', 'D'],
    boostSignals: ['carrying_heavy_load'],
  },
  {
    id: 'rec-technology',
    title: 'Technology Tools for Caregivers',
    description:
      'Apps, devices, and digital tools that can meaningfully reduce the coordination burden of complex care.',
    href: '/explore/technology-tools',
    type: 'tool',
    reason: 'Because the right tools can take real weight off your shoulders.',
    stages: ['C', 'D'],
    boostSignals: ['natural_care_coordinator'],
  },
  {
    id: 'rec-grief',
    title: 'The Unspoken Grief of Watching Someone Fade',
    description:
      'An honest look at anticipatory grief and the quiet losses that happen before a loved one is gone.',
    href: '/explore/unspoken-grief-watching-someone-fade',
    type: 'resource',
    reason: 'Because grief in caregiving starts long before the end — and naming it helps.',
    stages: ['D', 'E'],
    boostSignals: ['navigating_change'],
  },
  {
    id: 'rec-pero-community',
    title: 'Join the pero Community',
    description:
      "pero is building a space where caregivers can connect, share, and feel less alone. Be among the first.",
    href: '/waitlist',
    type: 'community',
    reason: 'Because caregiving can be isolating — and having people who understand makes a real difference.',
    stages: undefined,
    boostSignals: ['doing_it_without_backup'],
  },
  {
    id: 'rec-explore-all',
    title: 'Explore All Guides & Insights',
    description:
      "Browse pero's full library of resources organized by topic and caregiving situation.",
    href: '/explore',
    type: 'resource',
    reason: 'Because the right resource at the right moment can change everything.',
    stages: undefined,
    boostSignals: [],
  },
]
