// function HLMessages() {
//   let mod = 'CTRL';

//   if (navigator.userAgent.indexOf('Mac OS X') !== -1) {
//       mod = '⌘';
//   }

//   let featureUnavailable;
//   let limitReached;
//   let sharingUnavailable;

//   if (currentUser.isAdmin) {
//       featureUnavailable = 'This feature is unavailable for your current plan. Click here to go to the billing page.';
//       limitReached = 'You\'ve reached the email account limit of your Personal plan. Please <a href="/#/preferences/admin/billing">upgrade</a> it to enable more email accounts.';
//       sharingUnavailable = 'Email accounts can\'t be shared while on the Personal plan. Please <a href="/#/preferences/admin/billing">upgrade</a> it to enable inbox sharing.';
//   } else {
//       featureUnavailable = `This feature is unavailable for your current plan. Ask ${currentUser.tenant.accountAdmin} to upgrade your plan.`;
//       limitReached = `You've reached the email account limit of your Personal plan. Ask ${currentUser.tenant.accountAdmin} to upgrade your plan.`;
//       sharingUnavailable = `Email accounts can't be shared while on the Personal plan. Ask ${currentUser.tenant.accountAdmin} to upgrade your plan.`;
//   }

//   return {
//       general: {
//           featureUnavailable,
//           featureUnavailableInline: 'This feature is unavailable for your current plan. <br />Please <a href="/#/preferences/admin/billing">upgrade</a> to use this feature.',
//       },
//       pages: {
//           notFoundTitle: 'Not found',
//           serverErrorTitle: 'Error',
//           email: {
//               importingEmail: 'Importing your email',
//               failedLoading: 'Unable to load email',
//               noVariables: 'No template variables yet. You should create one!',
//               noPublicVariables: 'No public template variables yet.',
//               firstSetupHeader: 'Connect your Gmail account and Lily will show her true power.',
//               firstSetupText: 'Share your email conversations with colleagues, so your organization will be able to respond based on a complete history of communication.',
//               noFolders: 'No folders yet. You should create one!',
//               noTemplates: 'No templates yet. You should create one!',
//               accountShare: 'Give specific colleagues additional permissions to your email',
//               accountForm: {
//                   loadAllMail: 'Load all mail into Lily?',
//                   loadAllMailYes: 'Yes, load all email into Lily',
//                   loadAllMailNo: 'No, only load email received from now on',
//                   inboxTitle: 'This inbox is a',
//                   publicInboxInfo: 'Used by multiple people in the company, ergo info@ or support@',
//                   publicInboxExampleText: 'Example for your convenience',
//                   readOnlyInboxInfo: 'Hi! I just wanted to show an example of what your colleagues can read.',
//                   readOnlyInboxInfoSignature: 'Love Lily!',
//                   advancedInfo: 'Give specific colleagues additional permissions to your email',
//               },
//               accountList: {
//                   limitReached,
//                   sharingUnavailable,
//               },
//           },
//           errors: {
//               notFoundTitle: '404 - page not found',
//               notFound: 'I searched the universe to find this page, but it does not exist.',
//               serverErrorTitle: '500 - internal server error',
//               serverError: 'Darn, my space rocket won\'t launch due to technical issues.',
//               serverErrorSub: 'I will get that fixed. Please be patient in the meantime.',
//           },
//           generic: {
//               unknownUser: 'An unknown entity',
//               widgetItemSuggest: 'Check it out',
//               doesNotExist: 'Sorry, does not exist.',
//           },
//       },
//       activityStream: {
//           emailMetadataMessage: 'The content of this email is not visible to you because the owner has chosen not to share the full message',
//       },
//   };
// }
