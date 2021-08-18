//might come back to use this when restructuring
// 'use strict';
// module.exports = function(app) {
//     var bankprocess = require('../controllers/bankController');

//     // bank Routes
//     app.route('/signup')
//         .post(bankprocess.signup);

//     app.route('/account/:accountNumber')
//         .get(bankprocess.get_account)
//         .get(bankprocess.get_account_history)
//         .get(bankprocess.get_transaction_history)
//         .post(bankprocess.send_funds)


//   app.route('/tasks')
//     .get(todoList.list_all_tasks)
//     .post(todoList.create_a_task);


//   app.route('/tasks/:taskId')
//     .get(todoList.read_a_task)
//     .put(todoList.update_a_task)
//     .delete(todoList.delete_a_task);
//};