//helper functions that query db to ensure up-to-date selection prompts

const {
    generateInquirerPromptChoicesFromDbQuery,
    generateInquirerListPrompt
  } = require(`../helpers/helperFunctions`);
  
  const {
    queryListOfManagers,
    queryListOfDepartments,
    queryRoleIdByName,
    queryListOfRoles
  } = require(`./dbFunctions`)
  
  module.exports = {
    getManagerPrompt: async function () {
      let dbquery = await queryListOfManagers()
      let choices = await generateInquirerPromptChoicesFromDbQuery(dbquery)
      return generateInquirerListPrompt(choices, 'managerSelection', 'Please choose a manager:')
    },
  
    getDepartmentPrompt: async function () {
      let dbquery = await queryListOfDepartments();
      let choices = await generateInquirerPromptChoicesFromDbQuery(dbquery)
      return generateInquirerListPrompt(choices, 'departmentSelection', 'Please choose a department:')
    },
  
    getRolePrompt: async function () {
      let dbquery = await queryListOfRoles();
      let choices = await generateInquirerPromptChoicesFromDbQuery(dbquery)
      return generateInquirerListPrompt(choices, 'roleSelection', 'Please choose a role:')
    }
  
  
  };