document.addEventListener('DOMContentLoaded', function() {
    // Function to get URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Get the domain ID from the URL
    const domainId = getUrlParameter('domain');

    if (domainId) {
        fetchQuestions(domainId);
    } else {
        document.getElementById('questions-container').innerHTML = '<p>No domain specified.</p>';
    }

    // Function to fetch questions based on domain ID
    function fetchQuestions(domainId) {
        fetch(`https://api.example.com/questions?domain=${domainId}`)
            .then(response => response.json())
            .then(data => {
                displayQuestions(data);
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
                document.getElementById('questions-container').innerHTML = '<p>Error loading questions.</p>';
            });
    }

    // Function to display questions on the page
    function displayQuestions(questions) {
        const questionsContainer = document.getElementById('questions-container');
        questionsContainer.innerHTML = ''; // Clear previous content

        if (questions.length === 0) {
            questionsContainer.innerHTML = '<p>No questions found for this domain.</p>';
            return;
        }

        questions.forEach(question => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');
            questionElement.innerHTML = `
                <p><strong>${question.text}</strong></p>
                ${question.options.map(option => `
                    <label>
                        <input type="radio" name="q${question.id}" value="${option}">
                        ${option}
                    </label><br>
                `).join('')}
            `;
            questionsContainer.appendChild(questionElement);
        });
    }
});
