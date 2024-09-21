document.addEventListener('DOMContentLoaded', function() {
    let isRunning = false;

    document.getElementById('start-button').addEventListener('click', function() {
        fetch('/start', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status === 'Zamanlayıcı başlatıldı') {
                    isRunning = true;
                    updateProgress();
                    updateTreeCount(data.trees); // Fidan sayısını güncelle
                }
            });
    });

    document.getElementById('stop-button').addEventListener('click', function() {
        fetch('/stop', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                isRunning = false;
            });
    });

    function updateProgress() {
        if (!isRunning) return;
        fetch('/progress')
            .then(response => response.json())
            .then(data => {
                const progressPercentage = data.progress;
                document.getElementById('progress').style.width = progressPercentage + '%';
                let totalSeconds = (25 * 60 * (100 - progressPercentage)) / 100;
                let minutes = Math.floor(totalSeconds / 60);
                let seconds = Math.floor(totalSeconds % 60);
                document.getElementById('time-display').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                if (data.is_running) {
                    setTimeout(updateProgress, 1000);
                    updateTreeCount(data.trees); // Fidan sayısını güncelle
                }
            });
    }

    function updateTreeCount(count) {
        document.getElementById('tree-count').textContent = `Dikilen Fidan: ${count}`;
    }
});
