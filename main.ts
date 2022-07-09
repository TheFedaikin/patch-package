// import { runCommand } from './index'
const { runCommand } = require("./index")

console.log(runCommand('echo', process.cwd(), ['test']))