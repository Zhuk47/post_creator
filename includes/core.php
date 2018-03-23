<?php
/**
 * Created by PhpStorm.
 * User: Zhukoff
 * Date: 07.03.2018
 * Time: 10:55
 */

function zh_post_show_img()
{
    wp_enqueue_script("jquery");
    wp_enqueue_script('corescript', plugins_url('zh_post_editor/assets/js_core.js'));
}

add_action('wp_enqueue_scripts', 'zh_post_show_img');