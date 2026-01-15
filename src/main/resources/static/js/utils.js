// ============================================
// 유틸리티 함수
// ============================================

const Utils = {
    async postData(endpoint, data) {
        try {
            const response = await fetch(`/api${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Post error:', error);
            return null;
        }
    },

    showLoading(container) {
        container.innerHTML = '<div class="loading">로딩 중...</div>';
    },

    showError(container, message = '데이터를 불러올 수 없습니다.') {
        container.innerHTML = `<div class="error">${message}</div>`;
    },

    loadScript(src, callback) {
        const existingPageScripts = document.querySelectorAll('script[data-page-script]');
        existingPageScripts.forEach(script => {
            script.remove();
        });

        // 2. 새 script 요소 생성
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.setAttribute('data-page-script', 'true');

        // 3. 스크립트 로드 완료 시 콜백 함수 실행
        script.onload = () => {
            if (callback) callback();
        };

        // 4. 오류 처리
        script.onerror = () => {
            console.error(`스크립트 로드 실패: ${src}`);
        };

        // 5. DOM에 추가하여 로드 및 실행 트리거
        document.head.appendChild(script);
    }
};
