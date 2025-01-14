'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        passwordHash: bcrypt.hashSync('Password123!'), // strong password
        firstName: 'Demo',
        lastName: 'User',
        phone: '+12025550123',  // Valid US number with +1 country code
        bio: 'I am a demo user.',
        avatarUrl: 'https://via.placeholder.com/150',
        resumeUrl: 'https://example.com/resume/demo.pdf',
        socialLinks: JSON.stringify({ github: 'https://github.com/demo-user', linkedin: 'https://linkedin.com/in/demo-user' }),
        themePreference: 'system',
        githubConnected: true,
        linkedinConnected: true,
        githubUrl: 'https://github.com/demo-user',
        linkedinUrl: 'https://linkedin.com/in/demo-user',
        githubAccessToken: 'gh-access-token-demo',
        linkedinAccessToken: 'li-access-token-demo',
        company: 'Demo Company',
        career: 'Software Developer',
        location: 'San Francisco, CA',
        timezone: 'America/Los_Angeles',
        pronouns: 'they/them',
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        passwordHash: bcrypt.hashSync('Str0ngPassw0rd!'),
        firstName: 'Fake',
        lastName: 'UserOne',
        phone: '+12025550123',  // Another valid US number
        bio: 'I am Fake User 1.',
        avatarUrl: 'https://via.placeholder.com/150',
        resumeUrl: 'https://example.com/resume/user1.pdf',
        socialLinks: JSON.stringify({ github: 'https://github.com/fakeuser1', linkedin: 'https://linkedin.com/in/fakeuser1' }),
        themePreference: 'dark',
        githubConnected: false,
        linkedinConnected: false,
        githubUrl: null,
        linkedinUrl: null,
        githubAccessToken: null,
        linkedinAccessToken: null,
        company: 'Fake Company 1',
        career: 'Designer',
        location: 'New York, NY',
        timezone: 'America/New_York',
        pronouns: 'she/her',
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        passwordHash: bcrypt.hashSync('P@ssword456'),
        firstName: 'Fake',
        lastName: 'UserTwo',
        phone: '+12025550123',  // Yet another valid US number
        bio: 'I am Fake User 2.',
        avatarUrl: 'https://via.placeholder.com/150',
        resumeUrl: 'https://example.com/resume/user2.pdf',
        socialLinks: JSON.stringify({ github: 'https://github.com/fakeuser2', linkedin: 'https://linkedin.com/in/fakeuser2' }),
        themePreference: 'light',
        githubConnected: true,
        linkedinConnected: true,
        githubUrl: 'https://github.com/fakeuser2',
        linkedinUrl: 'https://linkedin.com/in/fakeuser2',
        githubAccessToken: 'gh-access-token-user2',
        linkedinAccessToken: 'li-access-token-user2',
        company: 'Fake Company 2',
        career: 'Data Scientist',
        location: 'Austin, TX',
        timezone: 'America/Chicago',
        pronouns: 'he/him',
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};