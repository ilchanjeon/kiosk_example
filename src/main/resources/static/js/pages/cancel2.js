$(function () {
    const $focusables = $('.cancel-list button, .bottom-btn a');
    let idx = -1;

    function focusAt(newIdx) {
        if (!$focusables.length) return;

        idx = (newIdx + $focusables.length) % $focusables.length;
        $focusables.removeClass('is-focus');
        $focusables.eq(idx).addClass('is-focus').trigger('focus');
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
