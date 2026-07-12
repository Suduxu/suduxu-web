export const changelogData = [
  {
    version: '1.2.0',
    date: '2026-07-12',
    title: 'Physics & Loading Updates',
    features: [
      'Added global loading spinner to all page transitions',
      'Introduced rotational physics for broken pieces in mid-air',
      'A-action grabbed items now return to their original position automatically',
      'Improved collision rotation tracking for physics objects'
    ],
    fixes: [
      'Resolved AABB collision bugs in the virtual controller interaction loop'
    ],
  },
  {
    version: '1.1.0',
    date: '2026-06-15',
    title: 'KMP Client Release',
    features: [
      'Kotlin Multiplatform client support for native mobile builds',
      'TCP and UDP connection protocols added to configuration'
    ],
    fixes: [
      'Mobile viewport scaling and overflow issues on smaller devices'
    ],
  }
];