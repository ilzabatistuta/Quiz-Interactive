const quizData = [
    {
        question: "Ibukota Indonesia ?",
        options: ["A. IKN ", "B. Jakarta ", "C. Bandung ", "D. Lampung ", "E. Surabaya"],
        correct: "B. Jakarta"
    },
    {
        question: "siapa nama presiden pertama?",
        options: ["A. Udin", "B. Soekarno", "C. Lampard", "D. Drogba", "E. Ronaldo"],
        correct: "B. Soekarno"
    },
    {
        question: "berapa hasil dari pertambahan 12 + 12?",
        options: ["A. 22", "B. 21", "C. 24", "D. 31", "E. 34"],
        correct: "C. 24"
    },
    {
        question: "Manakah yang bukan termasuk jenis alat musik tiup?",
        options: ["A. Gitar", "B. Saksofon", "C. Trompet", "D. Terompet", "E. Seruling"],
        correct: "A. Gitar"
    },
    {
        question: "Siapakah penulis buku 'Harry Potter'?",
        options: ["A. J.R.R. Tolkien", "B. J.K. Rowling", "C. George R.R. Martin", "D. C.S. Lewis", "E. Roald Dahl"],
        correct: "B. J.K. Rowling"
    },
    {
        question: "Berapa jumlah benua di dunia?",
        options: ["A. 4", "B. 5", "C. 6", "D. 7", "E. 8"],
        correct: "C. 6"
    },
    {
        question: "Apa ibu kota Jepang?",
        options: ["A. Seoul", "B. Tokyo", "C. Beijing", "D. Jakarta", "E. Manila"],
        correct: "B. Tokyo"
    },
    {
        question: "Berapa jumlah provinsi di Indonesia?",
        options: ["A. 38", "B. 31", "C. 32", "D. 33", "E. 34"],
        correct: "A. 38"
    },
    {
        question: "Berapa hasil dari perkalian 5 X 5?",
        options: ["A. 55", "B. 394", "C. 10", "D. 25", "E. 23"],
        correct: "D. 25"
    },
    {
        question: "Apa warna buah pisang?",
        options: ["A. Hijau", "B. Merah", "C. Biru", "D. Hitam", "E. Kuning"],
        correct: "E. Kuning"
    }
];

let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let userName = ''; // Menyimpan nama pengguna

function startQuiz() {
    document.getElementById('start').classList.add('hidden');
    document.getElementById('timer').classList.remove('hidden');

    let countdownNumber = 3;
    const countdownElement = document.getElementById('countdown');
    countdownElement.innerText = countdownNumber;

    const countdownInterval = setInterval(() => {
        countdownNumber--;
        countdownElement.innerText = countdownNumber;

        if (countdownNumber === 0) {
            clearInterval(countdownInterval);
            document.getElementById('timer').classList.add('hidden');

            // Tampilkan halaman nama setelah pertanyaan terakhir
            if (currentQuestion === quizData.length - 1) {
                document.getElementById('quiz').classList.add('hidden');
                document.querySelector('.navigation').classList.add('hidden');
                document.getElementById('nameEntry').classList.remove('hidden');
            } else {
                document.getElementById('quiz').classList.remove('hidden');
                document.querySelector('.navigation').classList.remove('hidden');
                loadQuestion();
            }
        }
    }, 1000);
}

function saveName(event) {
    event.preventDefault();
    userName = document.getElementById('userName').value;
    document.getElementById('nameEntry').classList.add('hidden');
    
    // Periksa apakah ini pertanyaan terakhir
    if (currentQuestion === quizData.length - 1) {
        showResults(); // Jika iya, tampilkan hasil langsung
    } else {
        document.getElementById('quiz').classList.remove('hidden');
        document.querySelector('.navigation').classList.remove('hidden');
        loadQuestion(); // Jika tidak, lanjutkan dengan pertanyaan berikutnya
    }
}

function loadQuestion() {
    const questionEl = document.getElementById("quiz");
    const currentQuiz = quizData[currentQuestion];
    questionEl.innerHTML = `
        <div class="question">${currentQuiz.question}</div>
        <ul class="options">
            ${currentQuiz.options.map((option, index) => `
                <li>
                    <input type="radio" name="answer" id="option${index}" value="${option.trim()}">
                    <label for="option${index}">${option}</label>
                </li>
            `).join('')}
        </ul>
    `;

    if (userAnswers[currentQuestion]) {
        const selectedOption = document.querySelector(`input[value="${userAnswers[currentQuestion]}"]`);
        if (selectedOption) {
            selectedOption.checked = true;
        }
    }

    updateNavigation();
    updateProgress();
}

function updateNavigation() {
    document.getElementById("prevBtn").style.visibility = currentQuestion > 0 ? "visible" : "hidden";
    document.getElementById("nextBtn").innerText = currentQuestion < quizData.length - 1 ? "Selanjutnya" : "Selesai";
}

function updateProgress() {
    const progress = document.getElementById("progress");
    const width = ((currentQuestion + 1) / quizData.length) * 100;
    progress.style.setProperty('--progress', `${width}%`);
}

function nextQuestion() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (!selectedOption && currentQuestion < quizData.length - 1) {
        alert("Silakan pilih jawaban Anda!");
        return;
    }

    if (selectedOption) {
        // Simpan jawaban lengkap pengguna
        userAnswers[currentQuestion] = selectedOption.value;
        if (selectedOption.value === quizData[currentQuestion].correct) {
            score++;
        }
    }

    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        document.getElementById('quiz').classList.add('hidden');
        document.querySelector('.navigation').classList.add('hidden');
        document.getElementById('nameEntry').classList.remove('hidden');
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

function showResults() {
    document.getElementById("quiz").classList.add("hidden");
    document.querySelector(".navigation").classList.add("hidden");
    document.getElementById("results").classList.remove("hidden");
    
    const scoreElement = document.getElementById("score");
    scoreElement.innerHTML = `Skor Anda: ${score}/${quizData.length}`;

    const resultList = document.getElementById("resultList");
    resultList.innerHTML = quizData.map((quiz, index) => `
        <li>
            <div class="question">${quiz.question}</div>
            <div class="answer">Jawaban Anda: ${userAnswers[index] || 'Tidak dijawab'}</div>
            <div class="correct">Jawaban Benar: ${quiz.correct}</div>
        </li>
    `).join('');

    saveToLeaderboard(userName, score); // Simpan ke leaderboard
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    document.getElementById("results").classList.add("hidden");
    document.getElementById("leaderboard").classList.add("hidden");
    document.getElementById("start").classList.remove("hidden");
}

function saveToLeaderboard(name, score) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function showLeaderboard() {
    document.getElementById("results").classList.add("hidden");
    document.getElementById("leaderboard").classList.remove("hidden");

    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const leaderboardBody = document.getElementById("leaderboardBody");
    leaderboardBody.innerHTML = leaderboard.map((entry, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
        </tr>
    `).join('');
}
