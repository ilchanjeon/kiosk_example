// 선택된 숫자 버튼의 value를 입력 필드에 채우기
document.querySelectorAll('.item-btn.number').forEach(button => {
    button.addEventListener('click', () => {
        const number = button.value;
        const inputs = document.querySelectorAll('input[onlyNumber]');

        for (const input of inputs) {
            if (!input.value) { // 비어 있는 첫 번째 입력 필드에 값 채우기
                input.value = number;
                input.type = 'password';
                break;
            }
        }
    });
});
// "재입력" 버튼 클릭 시 모든 입력값 초기화
document.querySelector('.item-btn.initi').addEventListener('click', () => {
    const inputs = document.querySelectorAll('input[onlyNumber]');
    inputs.forEach(input => {
        input.value = '';
    });
});

// "정정" 버튼 클릭 시 마지막 입력된 값을 제거
document.querySelector('.item-btn.delete').addEventListener('click', () => {
    const inputs = Array.from(document.querySelectorAll('input[onlyNumber]'));
    for (let i = inputs.length - 1; i >= 0; i--) {
        if (inputs[i].value) { // 값이 있는 마지막 필드를 비움
            inputs[i].value = '';
            break;
        }
    }
});

$(function () {
    const $focusables = $('.numbers-box_item input, .numbers-box_item button, .bottom-btn a');
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

        if (document.getElementById('alert').style.display === 'flex') {
            return;
        }

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
