

/*-- 상품구매 탭 --*/
function openCity(evt, cityName) {
    const proLists = document.querySelectorAll(".pro-box .pro-list");
    proLists.forEach(list => list.style.display = "none");

    const selectedList = document.getElementById(cityName);
    if (selectedList) selectedList.style.display = "block";

    const tabBtns = document.querySelectorAll(".pro-menu .tab-btn");
    tabBtns.forEach(btn => btn.classList.remove("active"));
    evt.currentTarget.classList.add("active");
}



/*-- 리스트 슬라이드 --*/
function listBox(listName) {
    const visibleCount = 3;

    $(listName).each(function () {
        const $bottom = $(this);
        const $items = $bottom.find('.item-box');
        let currentIndex = 0;

        const $right = $bottom.siblings('.right');

        function showItems() {
            $items.hide();
            if ($items.length <= visibleCount) {
                $items.show();
            } else {
                $items.slice(currentIndex, currentIndex + visibleCount).show();
            }
        }

        function ensureVisible(targetIdx) {
            if ($items.length <= visibleCount) return;

            if (targetIdx < currentIndex) currentIndex = targetIdx;
            else if (targetIdx >= currentIndex + visibleCount) currentIndex = targetIdx - visibleCount + 1;

            currentIndex = Math.max(0, Math.min(currentIndex, $items.length - visibleCount));
            showItems();
        }
        $bottom.data('ensureVisible', ensureVisible);

        // 버튼 이벤트 (중복 바인딩 방지)
        $right.find('.up').off('click.listBox').on('click.listBox', function () {
            if (currentIndex > 0) {
                currentIndex--;
                showItems();
            }
        });

        $right.find('.down').off('click.listBox').on('click.listBox', function () {
            if (currentIndex < $items.length - visibleCount) {
                currentIndex++;
                showItems();
            }
        });

        showItems();
    });
}

/*-- 리스트 슬라이드2 --*/
function listBox2(listName) {
    const visibleCount = 8; // 한 화면에 보여질 최대 아이템
    const stepCount = 4;    // 이동할 아이템 수

    $(listName).each(function () {
        const $bottom = $(this);
        const $items = $bottom.find('.item-box');
        let currentIndex = 0;

        const $right = $bottom.parent().find('.right');

        showItems();

        $right.find('.up').on('click', function () {
            if (currentIndex > 0) {
                currentIndex -= stepCount;
                if (currentIndex < 0) currentIndex = 0;
                showItems();
            }
        });

        $right.find('.down').on('click', function () {
            if (currentIndex + 1 < $items.length) { // 남은 아이템 있으면
                currentIndex += stepCount;
                if (currentIndex > $items.length - 1) currentIndex = $items.length - 1;
                showItems();
            }
        });

        function showItems() {
            $items.hide();
            $items.slice(currentIndex, currentIndex + visibleCount).show();
        }
    });
}





/*-- 탭메뉴 슬라이드 --*/
function tabMenu(tabSelector, visibleCount = 4) {
    $(tabSelector).each(function () {
        const $tab = $(this);
        const $menu = $tab.find('.pro-menu ul');
        const $items = $menu.find('li');
        const totalCount = $items.length;
        let currentIndex = 0;

        // 처음 보여주기
        showItems();

        // prev 버튼
        $tab.find('.prev button').on('click', function () {
            if (currentIndex > 0) {
                currentIndex--;
                showItems();
            }
        });

        // next 버튼
        $tab.find('.next button').on('click', function () {
            if (currentIndex < totalCount - visibleCount) {
                currentIndex++;
                showItems();
            }
        });

        function showItems() {
            $items.hide();
            $items.slice(currentIndex, currentIndex + visibleCount).show();
        }
    });
}






// 슬라이드
function productSlide(popupSlide) {
	$(popupSlide).slick({
		dots: false,
		infinite: false,
		speed: 0,
		autoplaySpeed: 4000,
		slidesToShow: 2,
		autoplay: false,
        vertical: true,
        draggable: false,
	});

}
