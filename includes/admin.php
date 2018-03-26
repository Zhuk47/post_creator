<?php
/**
 * Created by PhpStorm.
 * User: Zhukoff
 * Date: 07.03.2018
 * Time: 10:55
 */


// убираем стандартный editor
function zh_post_editor_remove_editor()
{
    remove_post_type_support('post', 'editor');
}

add_action('init', 'zh_post_editor_remove_editor');

// добавляем свой editor
function zh_post_editor_add_editor()
{
    wp_enqueue_script('nicEdit', plugins_url('zh_post_editor/assets/nicEdit/nicEdit.js'));
    wp_enqueue_script('myuploadscript', plugins_url('zh_post_editor/assets/js_admin.js'));
    wp_enqueue_style('nicEditGif', plugins_url('zh_post_editor/assets/nicEdit/nicEditorIcons.gif'));
}

add_action('admin_enqueue_scripts', 'zh_post_editor_add_editor');


// добавляем метабоксы
function zh_post_editor_meta_box()
{
    add_meta_box('autonumbering', 'Автонумерация', 'zh_post_editor_print_box', 'post', 'normal', 'high');
    add_meta_box('textarea', 'Вступительный текст', 'zh_post_editor_print_textarea_box', 'post', 'normal', 'high');
    add_meta_box('addblock', 'Добавление блоков', 'zh_post_editor_print_addblock_box', 'post', 'normal', 'high');
    add_meta_box('imagebox', 'Блок изображения', 'zh_post_editor_print_imagebox_box', 'post', 'normal', 'high');
}

add_action('admin_menu', 'zh_post_editor_meta_box');

// чекбокс автонумерации
function zh_post_editor_print_box($post)
{
    wp_nonce_field(basename(__FILE__), 'seo_metabox_nonce');
    $html = '';
    $html .= '<label><input type="checkbox" name="autonumbering" class="autonumbering" ';
    $html .= ' /> Включить автонумерацию?</label>';
    echo $html;
}


// вступительный текст
function zh_post_editor_print_textarea_box($post)
{
    wp_nonce_field(basename(__FILE__), 'seo_textarea_metabox_nonce');
    $html = '';
    $html .= '<label><textarea id="zhTextarea" class="zhTextarea" name="post_content" style="width: 99%; height: 300px">';
    $html .= get_post_field('post_content', $post->ID, 'edit');
    $html .= '</textarea></label>';
    $html .= '<script type="text/javascript">bkLib.onDomLoaded(nicEditors.allTextAreas);</script>';
    echo $html;
}

// добавление блоков
function zh_post_editor_print_addblock_box($post)
{
    wp_nonce_field(basename(__FILE__), 'seo_addblock_metabox_nonce');
    $html = '';
    $html .= '<input hidden name="num_of_img" value="">';
    $html .= '<label><button type="button" id="zhaddblock" name="addblock" class="button">Добавить блок</button>';
    $html .= ' ';
    $html .= '<button type="button" id="insert-media-button" class="button insert-media add_media">Загрузить картинки</button></label>';
    $html .= '<script>
	    var row = 1;
	    jQuery("body").on("click", "#zhaddblock", function() {
            var html = `<div class="zbox" id="zbox`+row+`"><input id="image_title" name="image_title`+row+`" placeholder="Заголовок картинки"/> <input type="button" value="up"> <input type="button" value="down"> <div></br></div><img class="imageboxsrc" id="imageboxsrc`+row+`" src=""/><div><input type="hidden" class="button imagebox_image" name="imagebox_image`+row+`" value=""/>   <button type="button" id="insert-media-button" class="upload_image_button button insert-media add_media">Вставить из библиотеки</button> <button type="button" class="remove_image_button button add_media">Удалить изображение</button></div><div></br></div><input id="image_src" name="image_src`+row+`" placeholder="Ссылка"/></div>`;
            $(html).appendTo($("#imagebox .inside"));
            row++;
        });
    </script>';
    echo $html;
}

// метабокс изображения
function zh_post_editor_print_imagebox_box($post)
{
    $image_id = get_post_meta($post->ID, 'imagebox_image', true);
    $image = wp_get_attachment_image_src($image_id);
    wp_nonce_field(basename(__FILE__), 'seo_imagebox_metabox_nonce');
    $html = '';
    if ($image_id) {
        $html .= '<div class="zbox" id="zbox0"><input id="image_title" name="image_title0" placeholder="Заголовок картинки"/> <input type="button" value="up"> <input type="button" value="down"> ';
        $html .= '<div></br></div>';
        $html .= '<img class="imageboxsrc" id="imageboxsrc0" src="' . $image[0] . '"/>';
        $html .= '<div><input type="hidden" class="button imagebox_image" name="imagebox_image0" value="' . $image_id . '"/><button type="button" id="insert-media-button" class="upload_image_button button insert-media add_media">Вставить из библиотеки</button> <button type="button" class="remove_image_button button add_media">Удалить изображение</button></div>';
        $html .= '<div></br></div>';
        $html .= '<input id="image_src" name="image_src0" placeholder="Ссылка"/></div>';
    } elseif (!$image_id) {
        $html .= '<div class="zbox" id="zbox0"><input id="image_title" name="image_title0" placeholder="Заголовок картинки"/> <input type="button" value="up"> <input type="button" value="down"> ';
        $html .= '<div></br></div>';
        $html .= '<img class="imageboxsrc" id="imageboxsrc0" src=""/>';
        $html .= '<div><input type="hidden" class="button imagebox_image" name="imagebox_image0" value=""/>   <button type="button" id="insert-media-button" class="upload_image_button button insert-media add_media">Вставить из библиотеки</button> <button type="button" class="remove_image_button button add_media">Удалить изображение</button></div>';
        $html .= '<div></br></div>';
        $html .= '<input id="image_src" name="image_src0" placeholder="Ссылка"/></div>';
    }
    echo $html;
}

// сохранение изображения
function zh_post_editor_save_imagebox_data($post_id)
{
//    var_dump($_POST);
    // проверка, пришёл ли запрос со страницы с метабоксом
    if (!isset($_POST['seo_imagebox_metabox_nonce']) || !wp_verify_nonce($_POST['seo_imagebox_metabox_nonce'], basename(__FILE__))) {
        return $post_id;
    }
    // проверка, является ли запрос автосохранением
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return $post_id;
    }
    // проверка, права пользователя, может ли он редактировать записи
    if (!current_user_can('edit_post', $post_id)) {
        return $post_id;
    }
    // проверка типа записи и сохранение
    $post = get_post($post_id);
    if ($post->post_type == 'post') {
        if (isset($_POST['imagebox_image1'])) {
            update_post_meta($post_id, 'imagebox_image1', $_POST['imagebox_image1']);
        } elseif (!isset($_POST['imagebox_image1'])) {
            update_post_meta($post_id, 'imagebox_image1', null);
        }
    }

    return $post_id;
}

add_action('save_post', 'zh_post_editor_save_imagebox_data');

//// отключение перетаскивания метабоксов
//function disable_drag_metabox() {
//	wp_deregister_script( 'postbox' );
//}
//
//add_action( 'admin_init', 'disable_drag_metabox' );