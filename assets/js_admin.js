/**
 * Created by Zhukoff on 14.02.2018.
 */

jQuery(function ($) {
    /*
     * действия при нажатии на кнопку загрузки изображения
     */
    $('body').on("click", ".upload_image_button", function () {
        var send_attachment_bkp = wp.media.editor.send.attachment;
        var button = $(this);
        var name = ($(this).prev().attr('name'));
        var row = name.slice(-1);

        wp.media.editor.send.attachment = function (props, attachment) {
            $(button).parent().prev().attr('src', attachment.url);
            $(button).prev().val(attachment.id);

            //добавляем в textarea
            $('.nicEdit-main').append('<div class="zhbox' + row + '">');
            $('div.zhbox' + row + '').append('<h3 id="image_title" class="image_title' + row + '">' + $('input[name=image_title' + row + ']').val() + '</h3>');
            $('img#imageboxsrc' + row + '').clone().appendTo('div.zhbox' + row + '');
            $('div.zhbox' + row + '').append('<div id="image_src" class="image_src' + row + '">' + $('input[name=image_src' + row + ']').val() + '</div></div>');

            //скрываем блоки с картинками в текстовом редакторе
            $('.nicEdit-main div').hide();

            // var textarea = $('.zhtextarea');
            // var src = $('img#imageboxsrc' + row + '').attr('src');
            // var p = $('.nicEdit-main p');
            // textarea.val(textarea.val() + '<div class="zhbox' + row + '">');
            // textarea.val(textarea.val() + '<h3 class="image_title' + row + '">' + $('input[name=image_title' + row + ']').val() + '</h3>');
            // textarea.val(textarea.val() + '<img class="imageboxsrc" id="imageboxsrc' + row + '" src="' + src + '">');
            // textarea.val(textarea.val() + '<div class="image_src' + row + '">' + $('input[name=image_src' + row + ']').val() + '</div>');
            // textarea.val(textarea.val() + '</div>');
            // textarea.val(p.html() + textarea.val());

            wp.media.editor.send.attachment = send_attachment_bkp;

        };
        wp.media.editor.open(button);
        return false;
    });

    /*
     * удаляем значение произвольного поля
     */
    $('body').on("click", ".remove_image_button", function () {
        var src = $(this).parent().prev().attr('data-src');
        $(this).parent().prev().attr('src', '');
        $(this).prev().prev().val('');
        // убрать картинку из формы записи
        var name = ($(this).prev().prev().attr('name'));
        var row = name.slice(-1);
        // $('.nicEdit-main img#imageboxsrc' + row + '').remove();
        // $('.nicEdit-main h3.image_title' + row + '').remove();
        // $('.nicEdit-main div.image_src' + row + '').remove();
        $('div.zhbox' + row + '').remove();
        // $('.nicEdit-main div:empty').not('div[class^=zhbox]').remove();
    });

    //перемещение блоков с картинками
    $('body').on('click', ".inside :button[value=down]", function () {
        $(this).closest('.zhbox').insertAfter($(this).closest('.zhbox').next());

        $('div.zhbox' + row + '').closest('div[class^=zhbox]').insertAfter($('div.zhbox' + row + '').closest('div[class^=zhbox]').next());
    });
    $('body').on('click', ".inside :button[value=up]", function () {
        $(this).closest('.zhbox').insertBefore($(this).closest('.zhbox').prev());
        var name = $(this).prev().attr('name');
        var row = name.slice(-1);
        $('div.zhbox' + row + '').closest('div[class^=zhbox]').insertBefore($('div.zhbox' + row + '').closest('div[class^=zhbox]').prev());
    });

    //автонумерация
    $('body').on('click', ".autonumbering", function () {
        var count = $('#imagebox .inside .zhbox').length;
        for (i = 1; i <= count; i++) {
            if ($(".autonumbering").is(":checked")) {
                $('#zhbox' + i + '').prepend('<b>' + i + '. </b>');
            } else {
                $('#zhbox' + i + ' b').remove();
            }
        }
    });

    //заполнение title и src картинки
    $('#image_title').on('input' ,function () {
        var row = $(this).attr('name').slice(-1);
        alert(row);
        var title = $(this).val();
        $('.nicEdit-main .zhbox1 #image_title1').empty();
        $('.nicEdit-main .zhbox1 #image_title1').append(title);
    });
    $('#image_src1').on('input' ,function () {
        var src = $(this).val();
        $('.nicEdit-main .zhbox1 #image_src1').empty();
        $('.nicEdit-main .zhbox1 #image_src1').append(src);
    });

});
