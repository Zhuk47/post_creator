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
        var name = ($(this).attr('id'));
        var row = name.slice(-1);

        wp.media.editor.send.attachment = function (props, attachment) {
            $('img#imageboxsrc'+row+'').attr('src', attachment.url);
            $('input[name=imagebox_image'+row+']').val(attachment.id);

            //добавляем в textarea
            var src1 = $('#zbox'+row+' img#imageboxsrc'+row+'').attr('src');
            if ($('.nicEdit-main div.zhbox' + row + '').length > 0) {
                $('div.zhbox' + row + ' h2').remove();
                $('div.zhbox' + row + '').append('<h2 id="image_title' + row + '" class="image_title' + row + '">' + $('input[name=image_title' + row + ']').val() + '</h2>');
                $('div.zhbox' + row + ' figure').remove();
                $('div.zhbox' + row + '').append('<figure><img id="imageboxsrc'+row+'" src="'+src1+'"></figure>');
            } else {
                $('.nicEdit-main').append('<div class="zhbox' + row + '">');
                $('div.zhbox' + row + '').append('<h2 id="image_title' + row + '" class="image_title' + row + '">' + $('input[name=image_title' + row + ']').val() + '</h2>');
                $('div.zhbox' + row + '').append('<figure><img id="imageboxsrc'+row+'" src="'+src1+'"></figure>');
            }

            //скрываем блоки с картинками в текстовом редакторе
            $('.nicEdit-main div').hide();

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
        // var src = $(this).parent().prev().attr('data-src');
        // $('img#imageboxsrc'+row+'').attr('src', '');
        // $('input[name=imagebox_image'+row+']').val('');
        $('div[id=zbox'+row+']').remove();
        // убрать картинку из формы записи
        $('div.zhbox' + row + '').remove();
        // $('input[name=image_title' + row + ']').val('');
        // $('input[name=image_src' + row + ']').val('');
    });

    //перемещение блоков с картинками
    $('body').on('click', ".inside :button[value=down]", function () {
        $(this).closest('.zbox').insertAfter($(this).closest('.zbox').next());
        var row = $(this).prev().prev().attr('name').slice(-1);
        $('div.zhbox' + row + '').closest('div[class^=zhbox]').insertAfter($('div.zhbox' + row + '').closest('div[class^=zhbox]').next());
    });
    $('body').on('click', ".inside :button[value=up]", function () {
        $(this).closest('.zbox').insertBefore($(this).closest('.zbox').prev());
        var row = $(this).prev().attr('name').slice(-1);
        $('div.zhbox' + row + '').closest('div[class^=zhbox]').insertBefore($('div.zhbox' + row + '').closest('div[class^=zhbox]').prev());
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
                $('.zhbox' + array[i] + ' h2').prepend(''+j+'. ');
            } else {
                $('#zbox' + array[i] + ' b').remove();
                var text = $('.zhbox' + array[i] + ' h2').text();
                text = text.replace(''+j+'. ', '');
                $('.zhbox' + array[i] + ' h2').text(text);
            }
            j++;
        }
    });

    //заполнение title и src картинки
    $('.inside').on('input', '#image_title', function () {
        var row = $(this).attr('name').slice(-1);
        var title = $(this).val();
        if ($('.nicEdit-main div.zhbox' + row + '').length > 0) {
            $('.nicEdit-main .zhbox' + row + ' h2').remove();
            $('.nicEdit-main .zhbox' + row + '').prepend('<h2 id="image_title' + row + '" class="image_title' + row + '">'+title+'</h2>');
        } else {
            $('.nicEdit-main').append('<div class="zhbox' + row + '">');
            $('.nicEdit-main .zhbox' + row + '').prepend('<h2 id="image_title' + row + '" class="image_title' + row + '">'+title+'</h2>');
        }
        //скрываем блоки с картинками в текстовом редакторе
        $('.nicEdit-main div').hide();
    });
    $('.inside').on('input', '#image_src', function () {
        var row = $(this).attr('name').slice(-1);
        var src = $(this).val();
        var site = src.split('//')[1].split('/')[0];
        $('.zbox img#imageboxsrc'+row+'').attr('src', src);
        if ($('.nicEdit-main div.zhbox' + row + '').length > 0) {
            $('.nicEdit-main .zhbox' + row + ' figure').remove();
            $('div.zhbox' + row + '').append('<figure>');
            $('div.zhbox' + row + ' figure').append('<img id="imageboxsrc'+row+'" src="'+src+'">');
            $('div.zhbox' + row + ' figure').append('<figcaption><a href="'+src+'" target="_blank">'+site+'</a></figcaption>');
        } else {
            $('.nicEdit-main').append('<div class="zhbox' + row + '">');
            $('div.zhbox' + row + '').append('<figure>');
            $('div.zhbox' + row + ' figure').append('<img id="imageboxsrc'+row+'" src="'+src+'">');
            $('div.zhbox' + row + ' figure').append('<figcaption><a href="'+src+'" target="_blank">'+site+'</a></figcaption>');
        }
        //скрываем блоки с картинками в текстовом редакторе
        $('.nicEdit-main div').hide();
    });

    //отображение картинок поста в редакторе
    $(window).load(function () {
        //скрываем блоки с картинками в текстовом редакторе
        $('.nicEdit-main div').hide();
        var array = [];
        $('.nicEdit-main div[class^=zhbox]').each(function () {
            array += $(this).attr('class').slice(-1);
        });
        var num = $('.nicEdit-main div[class^=zhbox]').length;
        if (num > 1) {
            for (var i = 0; i <= num-1; i++) {
                $('#zhaddblock').click();
                var title = $('.zhbox' + array[i] + ' h2').text();
                $('.zbox input[name=image_title' + i + ']').val(title);
                var img = $('.zhbox' + array[i] + ' img').attr('src');
                $('.zbox img[id=imageboxsrc' + i + ']').attr('src', img);
                var src = $('.zhbox' + array[i] + ' div').text();
                $('.zbox input[name=image_src' + i + ']').val(src);
            }
        }
    })

});
