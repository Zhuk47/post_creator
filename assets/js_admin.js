/**
 * Created by Zhukoff on 14.02.2018.
 */

jQuery(function ($) {

    //массовая загрузка изображений
    $('body').on("click", ".insert-media", function () {
        // $('#zhaddblock').click();
        var row = $('.inside div[class=zbox]:last').attr('id').slice(-1);
        var num = parseInt(row) + 1;
        wp.media.editor.send.attachment = function (props, attachment) {
            var source = attachment.url;
            $('div#zbox' + row + ' img.imageboxsrc').attr('src', source);

            if ($('div.zhbox' + row + '').length > 0) {
                $('div#addblock div.textareadiv').append('<div class="zhbox' + row + '"></div>');
                if ($(".autonumbering").is(":checked")) {
                    $('div.zhbox' + row + '').append('<h2>' + num + '. ' + $('input[name=image_title' + row + ']').val() + '</h2>');
                } else {
                    $('div.zhbox' + row + '').append('<h2>' + $('input[name=image_title' + row + ']').val() + '</h2>');
                }
                $('div.zhbox' + row + '').append('<figure><img src="' + source + '"/><figcaption><a href="" target="_blank"></a></figcaption></figure>');
                $('textarea.wp-editor-area').val($('div.textareadiv').html());
            } else {
                $('div#addblock div.textareadiv').append('<div class="zhbox' + row + '"></div>');
                if ($(".autonumbering").is(":checked")) {
                    $('div.zhbox' + row + '').append('<h2>' + num + '. ' + $('input[name=image_title' + row + ']').val() + '</h2>');
                } else {
                    $('div.zhbox' + row + '').append('<h2>' + $('input[name=image_title' + row + ']').val() + '</h2>');
                }
                $('div.zhbox' + row + '').append('<figure><img src="' + source + '"/><figcaption><a href="" target="_blank"></a></figcaption></figure>');
                $('textarea.wp-editor-area').val($('div.textareadiv').html());
            }

            $('#zhaddblock').click();
            row++;
            num++;
        };
    });

    //действия при нажатии на кнопку загрузки изображения
    $('body').on("click", ".upload_image_button", function () {
        var send_attachment_bkp = wp.media.editor.send.attachment;
        var button = $(this);
        var name = ($(this).attr('id'));
        var row = name.slice(-1);
        var num = parseInt(row) + 1;

        wp.media.editor.send.attachment = function (props, attachment) {
            $('img#imageboxsrc' + row + '').attr('src', attachment.url);
            $('input[name=imagebox_image' + row + ']').val(attachment.id);
            var source = attachment.url;

            $('div.zhbox' + row + '').remove();
            $('div#addblock div.textareadiv').append('<div class="zhbox' + row + '"></div>');
            if ($(".autonumbering").is(":checked")) {
                $('div.zhbox' + row + '').append('<h2>' + num + '. ' + $('input[name=image_title' + row + ']').val() + '</h2>');
            } else {
                $('div.zhbox' + row + '').append('<h2>' + $('input[name=image_title' + row + ']').val() + '</h2>');
            }
            $('div.zhbox' + row + '').append('<figure><img src="' + source + '"/><figcaption><a href="" target="_blank"></a></figcaption></figure>');
            $('textarea.wp-editor-area').val($('div.textareadiv').html());

            wp.media.editor.send.attachment = send_attachment_bkp;

        };
        wp.media.editor.open(button);
        return false;

    });

    /*
     * удаляем значение произвольного поля
     */
    $('body').on("click", ".remove_image_button", function () {
        var row = ($(this).attr('id').slice(-1));
        $('div[id=zbox' + row + ']').remove();
        // убрать картинку из формы записи
        $('div.zhbox' + row + '').remove();
        $('textarea.wp-editor-area').val($('div.textareadiv').html());
    });

    //перемещение блоков с картинками
    $('body').on('click', ".inside :button[id=down]", function () {
        $(this).closest('.zbox').insertAfter($(this).closest('.zbox').next());
        var row = $(this).prev().prev().attr('name').slice(-1);
        $('div.zhbox' + row + '').closest('div[class^=zhbox]').insertAfter($('div.zhbox' + row + '').closest('div[class^=zhbox]').next());
        $('textarea.wp-editor-area').val($('div.textareadiv').html());
    });
    $('body').on('click', ".inside :button[id=up]", function () {
        $(this).closest('.zbox').insertBefore($(this).closest('.zbox').prev());
        var row = $(this).prev().attr('name').slice(-1);
        $('div.zhbox' + row + '').closest('div[class^=zhbox]').insertBefore($('div.zhbox' + row + '').closest('div[class^=zhbox]').prev());
        $('textarea.wp-editor-area').val($('div.textareadiv').html());
    });

    //автонумерация
    $('body').on('click', ".autonumbering", function () {
        var array = [];
        $('#imagebox .inside div[class^=zbox]').each(function () {
            array += $(this).attr('id').slice(-1);
        });

        var count = $('#imagebox .inside .zbox').length;
        var j = 1;
        for (var i = 0; i <= count; i++) {
            if ($(".autonumbering").is(":checked")) {
                $('#zbox' + array[i] + '').prepend('<b>' + j + '. </b>');
                $('.zhbox' + array[i] + ' h2').prepend('' + j + '. ');
            } else {
                $('#zbox' + array[i] + ' b').remove();
                var text = $('.zhbox' + array[i] + ' h2').text();
                text = text.replace('' + j + '. ', '');
                $('.zhbox' + array[i] + ' h2').text(text);
            }
            j++;
        }
    });

    //заполнение title и src картинки
    $('.inside').on('input', '#image_title', function () {
        var row = $(this).attr('name').slice(-1);
        var title = $(this).val();
        if ($('div.textareadiv div.zhbox' + row + '').length > 0) {
            $('div.zhbox' + row + ' h2').remove();
            $('div.zhbox' + row + '').prepend('<h2>' + title + '</h2>');
            $('textarea.wp-editor-area').val($('div.textareadiv').html());
        } else {
            $('div.textareadiv').append('<div class="zhbox' + row + '">');
            $('div.zhbox' + row + ' h2').remove();
            $('div.zhbox' + row + '').prepend('<h2>' + title + '</h2>');
            $('textarea.wp-editor-area').val($('div.textareadiv').html());
        }
    });
    $('.inside').on('input', '#image_src', function () {
        var row = $(this).attr('name').slice(-1);
        var src = $(this).val();
        var site = src.split('//')[1].split('/')[0];
        $('.zbox img#imageboxsrc' + row + '').attr('src', src);
        if ($('div.zhbox' + row + '').length > 0) {
            $('div.zhbox' + row + ' figure').remove();
            $('div.zhbox' + row + '').append('<h2></h2>');
            $('div.zhbox' + row + '').append('<figure>');
            $('div.zhbox' + row + ' figure').append('<img src="' + src + '">');
            $('div.zhbox' + row + ' figure').append('<figcaption><a href="' + src + '" target="_blank">' + site + '</a></figcaption>');
            $('textarea.wp-editor-area').val($('div.textareadiv').html());
        } else {
            $('div.textareadiv').append('<div class="zhbox' + row + '">');
            $('div.zhbox' + row + '').append('<h2></h2>');
            $('div.zhbox' + row + '').append('<figure>');
            $('div.zhbox' + row + ' figure').append('<img src="' + src + '">');
            $('div.zhbox' + row + ' figure').append('<figcaption><a href="' + src + '" target="_blank">' + site + '</a></figcaption>');
            $('textarea.wp-editor-area').val($('div.textareadiv').html());
        }
    });

    //отображение картинок поста в редакторе
    $(window).load(function () {

        //скрываем блоки с картинками в текстовом редакторе (не скрывается в iFrame походу)
        // $('#tinymce').contents().getElementsByTagName('h2').hide();
        // $('#tinymce').contents().getElementsByTagName('figure').hide();

        // var iframe = frame.contentWindow.document.getElementById('tinymce');
        // iframe.document.getElementsByTagName('h2').style.display = 'none';
        // iframe.document.getElementsByTagName('figure').style.display = 'none';

        // $('iframe h2').hide();
        // $('iframe figure').hide();

        var images = [];
        var text = ($('textarea.wp-editor-area').val());
        $('#addblock').append('<div hidden class="textareadiv"></div>');
        $('div.textareadiv').html(text);

        var elems = $("<div/>", {html: text}).find("h2");
        var figures = $("<div/>", {html: text}).find("figure");
        var length = $("<div/>", {html: text}).find("h2").length;
        var i = 0;
        for (i; i < length; i++) {
            $('#zhaddblock').click();
            $('.zbox input[name=image_title' + i + ']').val(elems[i].innerHTML);
            images.push(figures[i].innerHTML);
            var src = images[i].split('"><fig')[0].split('src="')[1];
            $('.zbox img[id=imageboxsrc' + i + ']').attr('src', src);
        }

    });

    //добавление блока
    var rowCheck = 1;
    $("body").on("click", "#zhaddblock", function () {
        if (!$(".autonumbering").is(":checked")) {
            var html = '<div class="zbox" id="zbox' + rowCheck + '"><input id="image_title" name="image_title' + rowCheck + '" placeholder="Заголовок картинки"/> <input type="button" id="up" value="&#xf106" class="fa fa-angle-up"> <input type="button" id="down" value="&#xf107" class="fa fa-angle-down"> <div></br></div><img class="imageboxsrc" id="imageboxsrc' + rowCheck + '" src=""/><div><input type="hidden" class="button imagebox_image" name="imagebox_image' + rowCheck + '" value=""/><div id="zhbut"><button type="button" id="insert-media-button' + rowCheck + '" class="upload_image_button button insert-media add_media">Вставить из библиотеки</button> <button type="button" id="zhremove' + rowCheck + '" class="remove_image_button button add_media">Удалить изображение</button></div></div><div></br></div><input id="image_src" name="image_src' + rowCheck + '" placeholder="Ссылка"/></div>';
            $(html).appendTo($("#imagebox .inside"));
            rowCheck++;
        }
    });

    $("body").on("click", "#zhaddblock", function () {
        $(window).ready(function () {
            var rowUnCheck = $('.inside .zbox').length;
            var rowUnCheckNum = $('.inside .zbox').length + 1;
            if ($(".autonumbering").is(":checked")) {
                var html = '<div class="zbox" id="zbox' + rowUnCheck + '"><b>' + rowUnCheckNum + '. </b><input id="image_title" name="image_title' + rowUnCheck + '" placeholder="Заголовок картинки"/> <input type="button" id="up" value="&#xf106" class="fa fa-angle-up"> <input type="button" id="down" value="&#xf107" class="fa fa-angle-down"> <div></br></div><img class="imageboxsrc" id="imageboxsrc' + rowUnCheck + '" src=""/><div><input type="hidden" class="button imagebox_image" name="imagebox_image' + rowUnCheck + '" value=""/><div id="zhbut"><button type="button" id="insert-media-button' + rowUnCheck + '" class="upload_image_button button insert-media add_media">Вставить из библиотеки</button> <button type="button" id="zhremove' + rowUnCheck + '" class="remove_image_button button add_media">Удалить изображение</button></div></div><div></br></div><input id="image_src" name="image_src' + rowUnCheck + '" placeholder="Ссылка"/></div>';
                $(html).appendTo($("#imagebox .inside"));
                rowUnCheck++;
            }
        });
    });

});
