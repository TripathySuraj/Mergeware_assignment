import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

Meteor.startup(() => {
  // Create admin user
  if (!Meteor.users.findOne({ username: 'admin' })) {
    const adminId = Accounts.createUser({
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'admin123',
    });

    Roles.addUsersToRoles(adminId, 'admin');
  }
});

Accounts.onCreateUser((options, user) => {
  // Set default role to borrower for new users
  user.roles = ['borrower'];
  return user;
});

// Define roles
Roles.createRole('admin');
Roles.createRole('borrower');
Roles.createRole('lender');

// Define collections
Transactions = new Meteor.Collection('transactions');

Meteor.methods({
  'requestLoan'() {
    const userId = Meteor.userId();
    const loanId = Loans.insert({ borrowerId: userId, status: 'pending' });
    Transactions.insert({ userId, action: `Loan requested with ID ${loanId}` });
  },
  'payLoan'(loanId) {
    Loans.update(loanId, { $set: { status: 'paid' } });
    const lenderId = Meteor.userId();
    Transactions.insert({ userId: lenderId, action: `Loan paid with ID ${loanId}` });
  },
});
