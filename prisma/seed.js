const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Delete all data from all tables (in correct order due to foreign key constraints)
  console.log('🗑️  Cleaning existing data...');

  await prisma.reaction.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.article.deleteMany();
  await prisma.flashcard.deleteMany();
  await prisma.spaceSubscription.deleteMany();
  await prisma.spaceContribution.deleteMany();
  await prisma.space.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ All existing data deleted');

  // Create test users
  const hashedPassword = await bcrypt.hash('asdf', 10);
  const user1 = await prisma.user.create({
    data: {
      username: 'user1',
      email: 'test@example.com',
      password: hashedPassword,
      isAdmin: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'user2',
      email: 'user2@example.com',
      password: hashedPassword,
      isAdmin: false,
    },
  });

  console.log('✅ Created test users:', user1.username, 'and', user2.username);

  // Create main spaces (Level 1)
  const scienceOfBiology = await prisma.space.create({
    data: {
      name: 'The Science of Biology',
      about:
        'Explore the fundamental principles of biology, from cellular processes to complex ecosystems. This space covers the scientific method, biological organization, and the diversity of life on Earth.',
      level: 1,
    },
  });

  const chemistryOfLife = await prisma.space.create({
    data: {
      name: 'The Chemistry of Life',
      about:
        'Dive into the chemical foundations of life, including organic molecules, cellular chemistry, and biochemical processes that sustain living organisms.',
      level: 1,
    },
  });

  const biosphere = await prisma.space.create({
    data: {
      name: 'The Biosphere',
      about:
        'Discover the global ecosystem that encompasses all living organisms and their interactions with the physical environment across Earth.',
      level: 1,
    },
  });

  const ecosystemsAndCommunities = await prisma.space.create({
    data: {
      name: 'Ecosystems and Communities',
      about: 'Learn about ecological communities, species interactions, and the complex relationships that shape natural ecosystems.',
      level: 1,
    },
  });

  const populations = await prisma.space.create({
    data: {
      name: 'Populations',
      about:
        'Study population dynamics, growth patterns, and the factors that influence population size and distribution in biological systems.',
      level: 1,
    },
  });

  console.log('✅ Created main spaces (Level 1)');

  // Create subspaces under "The Biosphere" (Level 2)
  const whatIsEcology = await prisma.space.create({
    data: {
      name: 'What is Ecology?',
      about:
        'Explore the scientific study of interactions between organisms and their environment, including the principles and methods of ecological research.',
      level: 2,
      parentId: biosphere.id,
    },
  });

  const cycleOfMatter = await prisma.space.create({
    data: {
      name: 'Cycle of Matter',
      about:
        'Investigate the biogeochemical cycles that move essential elements like carbon, nitrogen, and phosphorus through ecosystems and the biosphere.',
      level: 2,
      parentId: biosphere.id,
    },
  });

  const roleOfClimate = await prisma.space.create({
    data: {
      name: 'The Role of Climate',
      about:
        'Understand how climate patterns influence biological systems, from individual species adaptations to global ecosystem distributions.',
      level: 2,
      parentId: biosphere.id,
    },
  });

  console.log('✅ Created subspaces under "The Biosphere" (Level 2)');

  // Create sub-subspaces (Level 3)
  const energyFlow = await prisma.space.create({
    data: {
      name: 'Energy Flow',
      about:
        'Trace the flow of energy through ecological systems, from primary producers to top predators, and understand food webs and trophic levels.',
      level: 3,
      parentId: whatIsEcology.id,
      bannerURL:
        'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  });

  const renewableAndNonrenewableEnergy = await prisma.space.create({
    data: {
      name: 'Renewable and Nonrenewable Energy',
      about:
        'Compare different energy sources and their environmental impacts, from fossil fuels to solar, wind, and other renewable technologies.',
      level: 3,
      parentId: roleOfClimate.id,
    },
  });

  console.log('✅ Created sub-subspaces (Level 3)');

  console.log('✅ No subspaces created for "The Science of Biology"');

  // Create some sample articles and flashcards for Level 3 spaces
  const sampleArticle = await prisma.article.create({
    data: {
      title: 'Introduction to Energy Flow in Ecosystems',
      text: 'Energy flow is a fundamental concept in ecology that describes how energy moves through biological systems. It begins with primary producers, such as plants and algae, which capture solar energy through photosynthesis. This energy is then transferred to herbivores, which consume the producers, and subsequently to carnivores and other higher trophic levels. At each step, energy is lost as heat due to metabolic processes, following the laws of thermodynamics. Understanding energy flow helps ecologists predict how changes in one part of an ecosystem can affect the entire system.',
      authorId: user1.id,
      spaceId: energyFlow.id,
    },
  });

  const sampleFlashcard = await prisma.flashcard.create({
    data: {
      title: 'Trophic Levels',
      shortDescription: 'The hierarchical levels in a food chain',
      longDescription:
        'Trophic levels represent the feeding positions in a food chain or web. Primary producers (plants, algae) are at the first trophic level, herbivores at the second, primary carnivores at the third, and so on. Each level typically contains about 10% of the energy from the level below it, with the rest lost as heat or used for metabolism. This energy loss limits the number of trophic levels in most ecosystems to four or five.',
      authorId: user1.id,
      spaceId: energyFlow.id,
    },
  });

  const renewableFlashcard = await prisma.flashcard.create({
    data: {
      title: 'Solar Energy Basics',
      shortDescription: 'Understanding photovoltaic technology',
      longDescription:
        'Solar energy is harnessed through photovoltaic (PV) cells that convert sunlight directly into electricity. These cells are made of semiconductor materials, typically silicon, that absorb photons from sunlight and release electrons, creating an electric current. Solar panels can be installed on rooftops, in solar farms, or integrated into building materials. The efficiency of solar panels has improved significantly over the years, and costs have decreased dramatically, making solar energy one of the most accessible renewable energy sources.',
      authorId: user1.id,
      spaceId: energyFlow.id,
    },
  });

  const renewableArticle = await prisma.article.create({
    data: {
      title: 'The Future of Renewable Energy',
      text: 'Renewable energy sources are becoming increasingly important as we address climate change and seek sustainable alternatives to fossil fuels. Solar power, wind energy, hydroelectric power, and geothermal energy offer clean, abundant sources of electricity. These technologies have advanced significantly in recent decades, with costs falling and efficiency improving. However, challenges remain, including energy storage, grid integration, and the environmental impacts of large-scale renewable energy projects. The transition to renewable energy requires careful planning and consideration of both environmental and economic factors.',
      authorId: user1.id,
      spaceId: energyFlow.id,
    },
  });

  console.log('✅ Created sample content for Level 3 spaces');

  // Create content directly in "The Science of Biology" space
  const biologyArticle1 = await prisma.article.create({
    data: {
      title: 'Understanding the Null Hypothesis',
      text: 'The null hypothesis is a fundamental concept in scientific research that serves as the default assumption in statistical testing. It typically states that there is no significant difference or relationship between variables. For example, if studying the effect of a new drug, the null hypothesis would be that the drug has no effect compared to a placebo. Scientists then design experiments to test this hypothesis, collecting data to determine whether to reject or fail to reject the null hypothesis. This approach helps prevent confirmation bias and ensures that conclusions are based on evidence rather than assumptions.',
      authorId: user1.id,
      spaceId: scienceOfBiology.id,
    },
  });

  const biologyFlashcard1 = await prisma.flashcard.create({
    data: {
      title: 'P-Value Significance',
      shortDescription: 'Understanding statistical significance levels',
      longDescription: 'The p-value is a measure of the strength of evidence against the null hypothesis. A p-value of 0.05 or less is typically considered statistically significant, meaning there is less than a 5% probability that the observed results occurred by chance alone. However, p-values should be interpreted carefully - they do not prove that a hypothesis is true, only that the null hypothesis is unlikely given the data. Lower p-values (like 0.01 or 0.001) provide stronger evidence against the null hypothesis. It\'s important to remember that statistical significance does not always equate to practical significance.',
      authorId: user1.id,
      spaceId: scienceOfBiology.id,
    },
  });

  const biologyArticle2 = await prisma.article.create({
    data: {
      title: 'Control Groups in Experimental Design',
      text: 'Control groups are essential components of well-designed scientific experiments. They provide a baseline for comparison and help researchers determine whether observed effects are due to the experimental treatment or other factors. In a controlled experiment, participants are randomly assigned to either the experimental group (which receives the treatment) or the control group (which does not). This randomization helps ensure that both groups are similar in all respects except for the treatment being tested. Control groups can be active (receiving a standard treatment) or passive (receiving no treatment or a placebo). The use of control groups is one of the key principles that distinguishes scientific research from anecdotal evidence.',
      authorId: user2.id,
      spaceId: scienceOfBiology.id,
    },
  });

  const biologyFlashcard2 = await prisma.flashcard.create({
    data: {
      title: 'Independent vs Dependent Variables',
      shortDescription: 'Key concepts in experimental design',
      longDescription: 'In experimental design, variables are classified as either independent or dependent. The independent variable is the factor that the researcher manipulates or changes to observe its effect. It is the presumed cause in the experiment. The dependent variable is the outcome that is measured or observed - it is the presumed effect that results from changes in the independent variable. For example, in a study testing the effect of fertilizer on plant growth, the amount of fertilizer would be the independent variable, and plant height would be the dependent variable. Identifying and properly controlling these variables is crucial for drawing valid conclusions from experimental data.',
      authorId: user2.id,
      spaceId: scienceOfBiology.id,
    },
  });

  const biologyArticle3 = await prisma.article.create({
    data: {
      title: 'The Scientific Method in Biology',
      text: 'The scientific method is the foundation of biological research and discovery. It involves systematic observation, hypothesis formation, experimentation, data collection, analysis, and conclusion drawing. In biology, this method helps researchers understand complex living systems, from cellular processes to ecosystem dynamics. The iterative nature of the scientific method allows for continuous refinement of our understanding as new evidence emerges. This systematic approach has led to groundbreaking discoveries in genetics, evolution, ecology, and many other biological fields.',
      authorId: user1.id,
      spaceId: scienceOfBiology.id,
    },
  });

  console.log('✅ Created content directly in "The Science of Biology" space');

  // Create some sample comments
  const comment1 = await prisma.comment.create({
    data: {
      text: 'Great explanation of the null hypothesis! This really helped clarify the concept for me.',
      authorId: user2.id,
      articleId: biologyArticle1.id,
      level: 1,
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      text: 'Thanks! I\'m glad it was helpful. The null hypothesis can be tricky to grasp at first.',
      authorId: user1.id,
      articleId: biologyArticle1.id,
      level: 1,
    },
  });

  const comment3 = await prisma.comment.create({
    data: {
      text: 'I have a question about p-values - what happens if you get a p-value of exactly 0.05?',
      authorId: user2.id,
      flashcardId: biologyFlashcard1.id,
      level: 1,
    },
  });

  console.log('✅ Created sample comments');

  console.log('🔄 Creating sample subscriptions...');

  // Create some sample subscriptions for the test users
  await prisma.spaceSubscription.createMany({
    data: [
      { userId: user1.id, spaceId: biosphere.id },
      { userId: user1.id, spaceId: whatIsEcology.id },
      { userId: user1.id, spaceId: energyFlow.id },
      { userId: user1.id, spaceId: scienceOfBiology.id },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Created sample subscriptions');

  console.log('🔄 Creating sample contributions...');

  // Create some sample contributions for the test users
  await prisma.spaceContribution.createMany({
    data: [
      { userId: user1.id, spaceId: energyFlow.id },
      { userId: user1.id, spaceId: renewableAndNonrenewableEnergy.id },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Created sample contributions');

  console.log('🔄 Creating sample alerts...');

  // Create some sample alerts
  await prisma.alert.createMany({
    data: [
      {
        type: 'subscription',
        message: 'New member joined Energy Flow in Ecosystems',
        userId: user1.id,
        spaceId: energyFlow.id,
        isRead: false
      },
      {
        type: 'subscription',
        message: 'New member joined What is Ecology?',
        userId: user1.id,
        spaceId: whatIsEcology.id,
        isRead: false
      }
    ],
    skipDuplicates: true,
  });

  console.log('✅ Created sample alerts');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Created:');
  console.log('- 2 test users (user1, user2)');
  console.log('- 5 main spaces (Level 1)');
  console.log('- 2 subspaces (Level 2)');
  console.log('- 2 sub-subspaces (Level 3)');
  console.log('- 7 sample articles (3 in Science of Biology, 4 in other spaces)');
  console.log('- 6 sample flashcards (2 in Science of Biology, 4 in other spaces)');
  console.log('- 4 sample subscriptions');
  console.log('- 2 sample contributions');
  console.log('- 2 sample alerts');
  console.log('- 3 sample comments');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
