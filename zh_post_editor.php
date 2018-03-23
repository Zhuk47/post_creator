<?php
/*
 * Plugin Name: Конструктор постов
 * Plugin URI:
 * Description: Конструктор постов работает по принципу создания постов из отдельных повторяющихся элементов.
 * Version: 1.0
 * Author: PandaCode
 * Author URI:
 * License: GPLv2 or later
 */

define( 'ZH_POST_EDITOR_DIR', plugin_dir_path( __FILE__ ) );
define( 'ZH_POST_EDITOR_URL', plugin_dir_url( __FILE__ ) );

function zh_post_editor_load() {

	if ( is_admin() ) // подключаем файлы администратора, только если он авторизован
	{
		require_once( ZH_POST_EDITOR_DIR . 'includes/admin.php' );
	}

	require_once( ZH_POST_EDITOR_DIR . 'includes/core.php' );
}

zh_post_editor_load();