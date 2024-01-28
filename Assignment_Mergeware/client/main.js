import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.dashboard.helpers({
  isAdmin() {
    return Roles.userIsInRole(Meteor.userId(), 'admin');
  },
  isBorrower() {
    return Roles.userIsInRole(Meteor.userId(), 'borrower');
  },
});

Template.borrowerDashboard.events({
  'click #requestLoan'(event, instance) {
    Meteor.call('requestLoan', (error, result) => {
      if (error) {
        console.log(error.reason);
      } else {
        console.log(result);
      }
    });
  },
});

Template.lenderDashboard.events({
  'click .payLoan'(event, instance) {
    const loanId = event.target.parentNode.textContent.trim();
    Meteor.call('payLoan', loanId, (error, result) => {
      if (error) {
        console.log(error.reason);
      } else {
        console.log(result);
      }
    });
  },
});

Template.adminDashboard.helpers({
  transactions() {
    return Transactions.find();
  },
});
