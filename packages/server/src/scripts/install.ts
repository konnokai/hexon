import path from "path"
import chalk from "chalk"
import inquirer from "inquirer"
import { container } from "tsyringe"
import { StorageService } from "~/shared/storage-service"
import { isBlog, toRealPath } from "~/shared/utils"
import { logo } from "./constants"
import { printer, printVersion } from "./utils"
import { HEXON_DEFAULT_PORT, HEXON_PORT_KEY } from "~/shared/constants"
import { HexoInstanceService } from "~/server/services/hexo-instance-service"

export default async function () {
  console.clear()
  console.log(chalk.blue(logo))

  printVersion()

  printer.section("Configuation")
  const portPrompt = {
    name: "port",
    message: "Which port do you like Hexon running at?",
    default: HEXON_DEFAULT_PORT,
    validate(v: number) {
      return !isNaN(v) || `number is required ${typeof v} given`
    },
    prefix: chalk.blue("?"),
  }
  const rootPrompt = {
    name: "root",
    message: `Your hexo blog path? ${chalk.grey(
      "Absolute or relative path to hexon."
    )}`,
    validate(v: string) {
      const truePath = toRealPath(v)
      try {
        return (
          isBlog(truePath) ||
          chalk.red.bold(truePath) + chalk.red(" is not a valid hexo blog.")
        )
      } catch (e) {
        console.error(e)
        return chalk.red("Fail to check path " + chalk.bold(truePath))
      }
    },
  }
  const answer = await inquirer.prompt([portPrompt, rootPrompt])
  const storage = container.resolve(StorageService)
  storage.set<string>(HexoInstanceService.HEXO_BASE_DIR_KEY, answer.root)
  storage.set<string>(HEXON_PORT_KEY, answer.port)

  printer.section("Install")
  const base = path.resolve(__dirname, "../../..")
  printer.success(`Hexon has been installed to \`${base}\``)
  printer.log(`Run \`yarn start\` to start`)
  printer.log(`Run \`yarn prd\` to start with pm2`)
  printer.log(chalk.grey(`To uninstall, remove the following foler: ${base}`))
}
