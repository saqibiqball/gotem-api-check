#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import routerTemplate from '../templates/router.template.js';
import controllerTemplate from '../templates/controller.template.js';
import serviceTemplate from '../templates/service.template.js';

const program = new Command();

program.name('mwt-api').description('Api files creator.').version('1.0.0');

const generate = program.command('generate').alias('g');

generate
	.command('router')
	.alias('r')
	.argument('<name>', 'Router name')
	.description('Generate router.')
	.action((name, cmd) => {
		const cleanName = name.replace(/\s/g, '').toLowerCase();
		if (!fs.existsSync(path.join(process.cwd(), 'routes') + `/${cleanName}.router.js`)) {
			fs.writeFileSync(
				path.join(process.cwd(), 'routes') + `/${cleanName}.router.js`,
				routerTemplate(cleanName)
			);
			console.log(chalk.green(`${new Date().toLocaleString()} Router ${cleanName} created.`));
		} else {
			console.log(chalk.red(`Router ${cleanName} exist.`));
		}
	});

generate
	.command('service')
	.alias('s')
	.argument('<name>', 'Service name')
	.description('Generate service.')
	.action((name, cmd) => {
		const cleanName = name.replace(/\s/g, '').toLowerCase();
		if (!fs.existsSync(path.join(process.cwd(), 'service') + `/${cleanName}.service.js`)) {
			fs.writeFileSync(
				path.join(process.cwd(), 'service') + `/${cleanName}.service.js`,
				serviceTemplate(cleanName)
			);
			console.log(
				chalk.green(`${new Date().toLocaleString()} Service ${cleanName} created.`)
			);
		} else {
			console.log(chalk.red(`Service ${cleanName} exist.`));
		}
	});

generate
	.command('controller')
	.alias('c')
	.argument('<name>', 'Controller name')
	.description('Generate controller.')
	.action((name, cmd) => {
		const cleanName = name.replace(/\s/g, '').toLowerCase();
		if (
			!fs.existsSync(path.join(process.cwd(), 'controllers') + `/${cleanName}.controller.js`)
		) {
			fs.writeFileSync(
				path.join(process.cwd(), 'controllers') + `/${cleanName}.controller.js`,
				controllerTemplate(cleanName)
			);
			console.log(
				chalk.green(`${new Date().toLocaleString()} Controller ${cleanName} created.`)
			);
		} else {
			console.log(chalk.red(`Controller ${cleanName} exist.`));
		}
	});

generate
	.command('api')
	.alias('a')
	.argument('<name>', 'API name')
	.description('Generate API (router + controller + service).')
	.action((name, cmd) => {
		const cleanName = name.replace(/\s/g, '').toLowerCase();
		if (!fs.existsSync(path.join(process.cwd(), 'routes') + `/${cleanName}.router.js`)) {
			fs.writeFileSync(
				path.join(process.cwd(), 'routes') + `/${cleanName}.router.js`,
				routerTemplate(cleanName)
			);
			console.log(chalk.green(`${new Date().toLocaleString()} Router ${cleanName} created.`));
		} else {
			console.log(chalk.red(`Router ${cleanName} exist.`));
		}

		if (
			!fs.existsSync(path.join(process.cwd(), 'controllers') + `/${cleanName}.controller.js`)
		) {
			fs.writeFileSync(
				path.join(process.cwd(), 'controllers') + `/${cleanName}.controller.js`,
				controllerTemplate(cleanName)
			);
			console.log(
				chalk.green(`${new Date().toLocaleString()} Controller ${cleanName} created.`)
			);
		} else {
			console.log(chalk.red(`Controller ${cleanName} exist.`));
		}

		if (!fs.existsSync(path.join(process.cwd(), 'service') + `/${cleanName}.service.js`)) {
			fs.writeFileSync(
				path.join(process.cwd(), 'service') + `/${cleanName}.service.js`,
				serviceTemplate(cleanName)
			);
			console.log(
				chalk.green(`${new Date().toLocaleString()} Service ${cleanName} created.`)
			);
		} else {
			console.log(chalk.red(`Service ${cleanName} exist.`));
		}
	});

// program
// 	.command('generate  <name>')
// 	.option('--extension <value>', 'File extension')
// 	.alias('c')
// 	.description('Create new configuration file.')
// 	.action((name, cmd) => {
// 		if (cmd.extension && !['json', 'txt', 'cfg'].includes(cmd.extension)) {
// 			console.log(chalk.red('Extension is not allowed.'));
// 		} else {
// 			inquirer
// 				.prompt([
// 					{
// 						type: 'input',
// 						name: 'charset',
// 						message: 'Charset: ',
// 					},
// 					{
// 						type: 'input',
// 						name: 'max_ram_usage',
// 						message: 'Max RAM usage, Mb: ',
// 					},
// 					{
// 						type: 'input',
// 						name: 'max_cpu_usage',
// 						message: 'Max CPU usage, %: ',
// 					},
// 					{
// 						type: 'input',
// 						name: 'check_updates_interval',
// 						message: 'Updates interval, ms: ',
// 					},
// 					{
// 						type: 'input',
// 						name: 'processes_count',
// 						message: 'Processes count: ',
// 					},
// 				])
// 				.then((options) => {
// 					if (cmd.extension && cmd.extension === 'json') {
// 						fs.writeFileSync(`files/${name}.${cmd.extension}`, JSON.stringify(options));
// 					} else {
// 						let data = '';
// 						for (let item in options) data += `${item}=${options[item]} \n`;
//
// 						fs.writeFileSync(`files/${name}.cfg`, data);
// 					}
// 					console.log(chalk.green(`\nFile "${name}.${cmd.extension || 'cfg'}" created.`));
// 				});
// 		}
// 	});
//
// program
// 	.command('all')
// 	.alias('a')
// 	.description('Show all configuration files.')
// 	.action(() => {
// 		const files = fs.readdirSync(path.join(process.cwd(), 'routes'));
//
// 		let data = '';
// 		for (let file of files) data += `${file} \n`;
//
// 		console.log(chalk.grey(`\nConfiguration files: \n\n${data}`));
// 	});

program.parse(process.argv);
