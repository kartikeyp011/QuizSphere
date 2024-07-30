document.querySelectorAll('.quiz-card').forEach(card => {
    card.addEventListener('click', function() {
        const topic = this.getAttribute('data-topic');
        console.log('Selected topic:', topic); // Add this line
        window.location.href = `quiz.html?topic=${topic}`;
    });
});
