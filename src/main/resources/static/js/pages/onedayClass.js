$(function () {
    let $target = null;

    // 리스트 선택
    $('.payment-bottom .item-box > button').on('click', function () {
        $('.payment-bottom .item-box > button').removeClass('on');
        $(this).addClass('on');
        $target = $(this);
    });

    // 수량 +
    $('.payment-top .add').on('click', function () {
        if (!$target) return;
        let $qty = $target.find('.item2');
        let n = parseInt($qty.text(), 10) || 0;
        $qty.text(n + 1);
    });

    // 수량 -
    $('.payment-top .min').on('click', function () {
        if (!$target) return;
        let $qty = $target.find('.item2');
        let n = parseInt($qty.text(), 10) || 0;
        if (n > 1) $qty.text(n - 1);
    });
});

$(function () {
    let idx = -1;

    function getFocusables() {
        const $tabs = $('.js-tab-box--2 .js-nav__list');
        const $products = $('.js-tab-box--2 .js-box.on .product-box__cont__item button');
        const $paymentBtns = $('.payment-top-right button');

        const $payListBtns = $('.pay-list .bottom button');
        const $paymentBottomLinks = $('.payment-bottom-right a');

        return $tabs
            .add($products)
            .add($paymentBtns)
            .add($payListBtns)
            .add($paymentBottomLinks);
    }

    function focusAt(newIdx) {
        const $f = getFocusables();
        if (!$f.length) return;

        idx = (newIdx + $f.length) % $f.length;
        $f.removeClass('is-focus');

        const el = $f.get(idx);
        $(el).addClass('is-focus').trigger('focus');
    }

    function focusNext() {
        const $f = getFocusables();
        focusAt(idx === -1 ? 0 : idx + 1);
    }

    function focusPrev() {
        const $f = getFocusables();
        focusAt(idx === -1 ? $f.length - 1 : idx - 1);
    }

    $(document).on('keydown', function (e) {
        const key = e.key;

        if (key === 'ArrowRight' || key === 'ArrowDown') {
            e.preventDefault();
            focusNext();
        }
        if (key === 'ArrowLeft' || key === 'ArrowUp') {
            e.preventDefault();
            focusPrev();
        }

        if (key === 'Enter' || key === 'NumpadEnter') {
            e.preventDefault();
            const $f = getFocusables();
            const el = $f.get(idx === -1 ? 0 : idx);
            if (el) el.click();
        }

        if (key === 'F11' || key === 'F12') {
            const $f = getFocusables();
            const el = $f.get(idx);

            if ($(el).is('.pay-list .bottom button')) {
                e.preventDefault();

                if (key === 'F11') {
                    $('.payment-top .min').trigger('click');
                }
                if (key === 'F12') {
                    $('.payment-top .add').trigger('click');
                }
            }
        }
    });

    $('.js-tab-box--2').on('click', '.js-nav__list .tab-btn', function () {
        idx = -1;
    });

});