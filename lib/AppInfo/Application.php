<?php
/**
 * @copyright Copyright (c) 2018 niTEC GesbR https://nitec.at
 * @author Michael Flucher <michael.flucher@nitec.at>
 *
 * Permission is hereby granted to 
 *
 * all our Customers
 *
 * obtaining a copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge or publish this Software. 
 *
 * Noone is permitted to use or sell parts of the Software or the whole Software 
 * without the written permission of niTEC GesbR. 
 */

namespace OCA\Spwm\AppInfo;

use OCP\AppFramework\App;
use OCP\IDBConnection;
use OCP\IConfig;

use OCA\Spwm\Controller\PageController;
use OCA\Spwm\Controller\AdminController;
use OCA\Spwm\Controller\AuthenticationController;
use OCA\Spwm\Controller\CredentialController;
use OCA\Spwm\Controller\DataController;
use OCA\Spwm\Service\SettingsService;
use OCA\Spwm\Service\AdminService;
use OCA\Spwm\Service\CryptService;
use OCA\Spwm\Service\AuthenticationService;
use OCA\Spwm\Service\DataService;
use OCA\Spwm\Service\CategoryService;
use OCA\Spwm\Utility\Utils;

class Application extends App {
	public function __construct(array $urlParams=array()) {
		parent::__construct('spwm', $urlParams);

		$container = $this->getContainer();

		/**
		 * Aliases
		 */
		$container->registerAlias('IDBConnection', IDBConnection::class);
		$container->registerAlias('IConfig', IConfig::class);

		$container->registerAlias('PageController', PageController::class);
		$container->registerAlias('AdminController', AdminController::class);
		$container->registerAlias('AuthenticationController', AuthenticationController::class);
		$container->registerAlias('CredentialController', CredentialController::class);
		$container->registerAlias('DataController', DataController::class);
		$container->registerAlias('SettingsService', SettingsService::class);
		$container->registerAlias('AdminService', AdminService::class);
		$container->registerAlias('CryptService', CryptService::class);
		$container->registerAlias('AuthenticationService', AuthenticationService::class);
		$container->registerAlias('DataService', DataService::class);
		$container->registerAlias('CategoryService', CategoryService::class);
		$container->registerAlias('Utils', Utils::class);
	}
}