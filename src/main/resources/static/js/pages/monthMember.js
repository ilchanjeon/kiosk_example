const items = document.querySelectorAll('.lesson-list .bottom .item-box');

items.forEach(btn => {
    btn.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('active'));
        btn.classList.add('active');

        const item1Text = btn.querySelector('.item1').textContent;
        const item2Text = btn.querySelector('.item2').textContent;
        const item3Text = btn.querySelector('.item3').textContent;
        const item4Text = btn.querySelector('.item4').textContent;

        document.querySelector('.lesson-choose .item1 .con p').textContent = item1Text;
        document.querySelector('.lesson-choose .item2 .startDate p').textContent = item2Text;
        document.querySelector('.lesson-choose .item2 .endDate p').textContent = item3Text;
        document.querySelector('.lesson-choose .item3 .con em').textContent = item4Text;
    });
});

listBox('.js-list-box');

$(function () {
    const $focusables = $('.bottom button, .bottom-btn a');
    let idx = -1;

    function focusAt(newIdx) {
        if (!$focusables.length) return;

        idx = (newIdx + $focusables.length) % $focusables.length;
        $focusables.removeClass('is-focus');

        const el = $focusables.get(idx);

        const $listBox = $(el).closest('.js-list-box');
        if ($listBox.length) {
            const ensureVisible = $listBox.data('ensureVisible');
            if (ensureVisible) {
                const itemIdx = $listBox.find('.item-box').index(el);
                if (itemIdx > -1) ensureVisible(itemIdx);
            }
        }

        $(el).addClass('is-focus').trigger('focus');
    }

    function focusNext() {
        focusAt(idx === -1 ? 0 : idx + 1);
    }

    function focusPrev() {
        focusAt(idx === -1 ? $focusables.length - 1 : idx - 1);
    }

    $(document).on('keydown', function (e) {
        const key = e.key;

        if (key === 'ArrowRight' || key === 'ArrowDown') {
            e.preventDefault();
            focusNext();
            return;
        }

        if (key === 'ArrowLeft' || key === 'ArrowUp') {
            e.preventDefault();
            focusPrev();
            return;
        }

        if (key === 'Enter' || key === 'NumpadEnter') {
            e.preventDefault();

            const targetIdx = (idx === -1) ? 0 : idx;
            const el = $focusables.get(targetIdx);

            if (el) el.click();
        }
    });

    // 마우스 / 터치 / 탭 포커스 동기화
    $focusables.on('focus', function () {
        idx = $focusables.index(this);
        $focusables.removeClass('is-focus');
        $(this).addClass('is-focus');
    });
});
