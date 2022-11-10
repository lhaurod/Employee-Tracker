require(`dotenv`).config()
const inquirer = require(`inquirer`);
const cTable = require(`console.table`);
const database = require(`./config/connection`);

//helper functions that query db to ensure up-to-date selection prompts
const {
  getManagerPrompt,
  getDepartmentPrompt,
  getRolePrompt
} = require(`./dbInteraction/dbDynamicPromptFunctions`)

//functions that directly handle user dbquery selection and present results
const {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addNewDepartment,
  addNewRole,
  addNewEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
  viewEmployeesByManager,
  viewEmployeesByDepartment,
  deleteDepartment,
  deleteRole,
  deleteEmployee,
  viewDepartmentBudgets,
  queryDepartmentIdByName,
  queryRoleIdByName,
  queryEmployeeIdByLastName,
} = require(`./dbInteraction/dbFunctions`);


let questions = [
  {
    type: 'list',
    name: 'selectAction',
    message: 'What would you like to do?',
    pageSize: 18,
    choices: [
      'View all company departments',
      'View all company roles',
      'View all company employees',
      'View employees under a specific manager',
      'View employees in a specific department',
      'View all department salary budgets',
      new inquirer.Separator(),
      'Add a new company department',
      'Add a new company role',
      'Add a new company employee',
      new inquirer.Separator(),
      "Update an employee's role",
      "Update an employee's manager",
      new inquirer.Separator(),
      "Delete a company department",
      "Delete a company role",
      "Delete a company employee",
      new inquirer.Separator(),
      "Exit Company Database",
      new inquirer.Separator()
    ]
  },

];

let nextActionQuestions = [{
  type: `list`,
  name: `nextAction`,
  message: 'What would you like to do now?',
  choices: [
    `Run a different query or command`,
    `Repeat same query`,
    `Exit Company Database`
  ]
}];


//MAIN QUERY HANDLER
let answerSwitch = async (answer) => {
  switch (answer) {
    case 'View all company departments':
      await viewAllDepartments()
      break;



    case 'View all company roles':
      await viewAllRoles();
      break;



    case 'View all company employees':
      await viewAllEmployees();
      break;



    case 'View employees under a specific manager':
      await getManagerPrompt()
        .then(async (managerPrompt) => {
          let choice = await inquirer.prompt(managerPrompt);
          return choice.managerSelection;
        })
        .then(choice => viewEmployeesByManager(choice));
      break;



    case 'View employees in a specific department':
      await getDepartmentPrompt()
        .then(async (departmentPrompt) => {
          let choice = await inquirer.prompt(departmentPrompt);
          return choice.departmentSelection;
        })
        .then(choice =>
          viewEmployeesByDepartment(choice)
        );
      break;



    case 'View all department salary budgets':
      await viewDepartmentBudgets();
      break;



    case 'Add a new company department':
      await inquirer.prompt({
        type: `input`,
        name: `newDepartmentName`,
        message: 'Please enter name of new department',
      })
        .then(async (input) => {
          await addNewDepartment(input.newDepartmentName)
        })
        .then(async () => {
          return await inquirer.prompt({
            type: `list`,
            name: `viewDepartments`,
            message: `View departments?`,
            choices: [
              `Yes`,
              `No`
            ]
          })
        })
        .then(async (response) => {
          if (response.viewDepartments === `Yes`) {
            await viewAllDepartments()
          }
          return;
        })
      break;



    case 'Add a new company role':
      //default prompts for this query line
      let addRolePrompts = [
        {
          type: `input`,
          name: `newRoleTitle`,
          message: 'Please enter name of new role',
        },
        {
          type: `input`,
          name: `newRoleSalary`,
          message: 'Please enter annual salary in USD for new role. Please include only numeric characters.',
          validate: async (input) => {
            return new Promise((resolve, reject) => {
              let parsedInt = parseInt(input)
              if (Number.isNaN(parsedInt)) {
                reject('Please enter a valid number.');
              }
              resolve(true);
            })
          }
        },
      ];
      //add dynamic department prompts
      let departmentPrompt = await getDepartmentPrompt()
      addRolePrompts.push(departmentPrompt);

      //begin inquirer prompt sequence
      await inquirer.prompt(addRolePrompts)
        .then(async (input) => {
          let newRoleTitle = input.newRoleTitle
          let newRoleSalary = parseInt(input.newRoleSalary)
          let newRoleDepartmentid = await queryDepartmentIdByName(input.departmentSelection);

          await addNewRole(newRoleTitle, newRoleSalary, newRoleDepartmentid)
        })
        .then(async () => {
          return await inquirer.prompt({
            type: `list`,
            name: `viewRoles`,
            message: `View all roles?`,
            choices: [
              `Yes`,
              `No`
            ]
          })
        })
        .then(async (response) => {
          if (response.viewRoles === `Yes`) {
            await viewAllRoles()
          }
          return;
        })
      break;



    case 'Add a new company employee':
      let addEmployeePrompts = [
        {
          type: `input`,
          name: `firstName`,
          message: 'Please enter the first name of new employee.'
        },
        {
          type: `input`,
          name: `lastName`,
          message: 'Please enter the last name of new employee.'
        },
      ];

      //generate dynamic prompt sequence
      let rolePrompt = await getRolePrompt();
      let managerPrompt = await getManagerPrompt();
      await managerPrompt.choices.push(`Employee does not have a manager. (SELECT TO LEAVE NULL)`);
      addEmployeePrompts.push(rolePrompt, managerPrompt)

      //begin inquirer prompt sequence
      await inquirer.prompt(addEmployeePrompts)
        .then(async (input) => {
          let { firstName, lastName, roleSelection, managerSelection } = input;
          let roleId = await queryRoleIdByName(roleSelection);
          let managerId = null;
          if (managerSelection !== `Employee does not have a manager. (SELECT TO LEAVE NULL)`) {
            managerId = await queryEmployeeIdByLastName(managerSelection);
          }
          await addNewEmployee(firstName, lastName, roleId, managerId);
        })
        .then(async () => {
          return await inquirer.prompt({
            type: `list`,
            name: `viewEmployees`,
            message: `View all employees?`,
            choices: [
              `Yes`,
              `No`
            ]
          })
        })
        .then(async (response) => {
          if (response.viewEmployees === `Yes`) {
            await viewAllEmployees()
          }
          return;
        })
      break;



    case "Update an employee's role":
      let updateRolePrompts = [
        {
          type: `input`,
          name: `employeeId`,
          message: 'Please reference the above and enter the ID of the employee whose role you want to update.',
          validate: async (input) => {
            return new Promise((resolve, reject) => {
              let parsedInt = parseInt(input)
              if (Number.isNaN(parsedInt)) {
                reject('Please enter a valid number.');
              }
              resolve(true);
            })
          }
        },
        await getRolePrompt()
      ]

      await viewAllEmployees()
      let input = await inquirer.prompt(updateRolePrompts);
      let { employeeId, roleSelection } = await input;
      await updateEmployeeRole(roleSelection, employeeId);
      let updateManagerPrompt = await inquirer.prompt(
        {
          type: `list`,
          name: `updateManager`,
          message: `Update employee manager?`,
          choices: [
            `Yes`,
            `No`
          ]
        }
      )
      if (await updateManagerPrompt.updateManager === `Yes`) {
        await answerSwitch("Update an employee's manager")
      }
      let viewEmployeesPrompt = await inquirer.prompt(
        {
          type: `list`,
          name: `viewEmployees`,
          message: `View all employees?`,
          choices: [
            `Yes`,
            `No`]
        }
      )
      if (viewEmployeesPrompt.viewEmployees === `Yes`) {
        await viewAllEmployees()
      }
      break;




    case "Update an employee's manager":
      let updateManagerPrompts = [
        {
          type: `input`,
          name: `employeeIdForManagerUpdate`,
          message: 'Please reference the above and enter the ID of the employee whose manager you want to update.',
          validate: async (input) => {
            return new Promise((resolve, reject) => {
              let parsedInt = parseInt(input)
              if (Number.isNaN(parsedInt)) {
                reject('Please enter a valid number.');
              }
              resolve(true);
            })
          }
        },
        await getManagerPrompt()
      ]

      await viewAllEmployees()
      let managerUpdateInput = await inquirer.prompt(updateManagerPrompts);
      let { employeeIdForManagerUpdate, managerSelection } = await managerUpdateInput;
      let managerId = await queryEmployeeIdByLastName(managerSelection);
      await updateEmployeeManager(managerId, employeeIdForManagerUpdate);

      let viewEmployeesUpdatedManagerPrompt = await inquirer.prompt(
        {
          type: `list`,
          name: `viewEmployees`,
          message: `Employee ${employeeIdForManagerUpdate} manager updated to ${managerSelection}. View all employees?`,
          choices: [
            `Yes`,
            `No`]
        }
      )
      if (viewEmployeesUpdatedManagerPrompt.viewEmployees === `Yes`) {
        await viewAllEmployees()
      }
      break;



    case "Delete a company department":
      let departmentDeletePrompts = [
        await getDepartmentPrompt(),
        {
          type: `list`,
          name: `confirmDelete`,
          message: `\n\nWARNING!\n\nDELETING A DEPARTMENT WILL ALSO DELETE ALL ROLES AND EMPLOYEES IN THAT DEPARTMENT!\n\nAre you sure you wish to proceed?`,
          default: `No`,
          choices: [
            `Yes`,
            `No`]
        }
      ];
      let departmentDeleteResults = await inquirer.prompt(departmentDeletePrompts);
      if (departmentDeleteResults.confirmDelete === `Yes`) {
        await deleteDepartment(departmentDeleteResults.departmentSelection);
      }
      let viewDepartmentsAfterDelete = await inquirer.prompt({
        type: `list`,
        name: `viewDepartments`,
        message: `View departments?`,
        choices: [
          `Yes`,
          `No`
        ]
      })
      if (await viewDepartmentsAfterDelete.viewDepartments === `Yes`) {
        await viewAllDepartments()
      }
      break;



    case "Delete a company role":
      let roleDeletePrompts = [
        await getRolePrompt(),
        {
          type: `list`,
          name: `confirmDelete`,
          message: `\n\nWARNING!\n\nDELETING A ROLE WILL ALSO DELETE ALL EMPLOYEES IN THAT ROLE!\n\nAre you sure you wish to proceed?`,
          default: `No`,
          choices: [
            `Yes`,
            `No`]
        }
      ];
      let roleDeleteResults = await inquirer.prompt(roleDeletePrompts);
      if (roleDeleteResults.confirmDelete === `Yes`) {
        await deleteRole(roleDeleteResults.roleSelection);
      }
      let viewRolesAfterDelete = await inquirer.prompt({
        type: `list`,
        name: `viewRoles`,
        message: `View all roles?`,
        choices: [
          `Yes`,
          `No`
        ]
      })
      if (await viewRolesAfterDelete.viewRoles === `Yes`) {
        await viewAllRoles()
      }
      break;

    case "Delete a company employee":
      let employeeDeletePrompts = [
        {
          type: `input`,
          name: `employeeIdToDelete`,
          message: 'Please reference the above and enter the ID of the employee to be deleted.',
          validate: async (input) => {
            return new Promise((resolve, reject) => {
              let parsedInt = parseInt(input)
              if (Number.isNaN(parsedInt)) {
                reject('Please enter a valid number.');
              }
              resolve(true);
            })
          }
        },
        {
          type: `list`,
          name: `confirmDelete`,
          message: `\n\nWARNING!\n\nDELETING AN EMPLOYEE MAY LEAVE SOME ROLES UNFILLED AND IS A PERMANENT ACTION! \n\nIF AN EMPLOYEE IS A MANAGER, DELETING THEM WILL ALSO DELETE THEIR DIRECT REPORTS! PLEASE ENSURE EMPLOYEE MANAGERS HAVE BEEN REASSIGNED.\n\nAre you sure you wish to proceed?`,
          default: `No`,
          choices: [
            `Yes`,
            `No`]
        }
      ];
      await viewAllEmployees();
      let employeeDeleteResults = await inquirer.prompt(employeeDeletePrompts);
      if (employeeDeleteResults.confirmDelete === `Yes`) {
        await deleteEmployee(employeeDeleteResults.employeeIdToDelete);
      }
      let viewEmployeesAfterDelete = await inquirer.prompt({
        type: `list`,
        name: `viewEmployees`,
        message: `View all employees?`,
        choices: [
          `Yes`,
          `No`
        ]
      })
      if (await viewEmployeesAfterDelete.viewEmployees === `Yes`) {
        await viewAllEmployees();
      }
      break;



    case "Exit Company Database":
      exitDatabase();
      return "exit";
  }
}

let exitDatabase = () => {
  console.log(`\n\nGoodbye!\n\n`)
  database.close();
}

let nextActionPrompt = async (previousAnswer) => {
  let nextAction = await inquirer.prompt(nextActionQuestions);
  switch (nextAction.nextAction) {
    case `Run a different query or command`:
      init();
      break;
    case `Repeat same query`:
      console.log(previousAnswer);
      await answerSwitch(previousAnswer);
      await nextActionPrompt(previousAnswer);
      break;
    case `Exit Company Database`:
      exitDatabase();
      return;
  }
};

let init = () => {
  inquirer.prompt(questions)
    .then(async (answer) => {
      let previousAnswer = answer.selectAction;
      let exit = await answerSwitch(previousAnswer);
      if (exit) {
        return;
      }
      await nextActionPrompt(previousAnswer);
    })
}

//BEGINS PROGRAM
init();



