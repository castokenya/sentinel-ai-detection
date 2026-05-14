// 1. Configuration
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

let isExamActive = false;

// 2. Core Functions
async function loadIncidents() {
    let { data: incidents, error } = await supabase.from('incidents').select('*');
    if (error) {
        console.error('Error loading data:', error);
        return;
    }
    const tableBody = document.querySelector('tbody');
    if (!tableBody) return; // Safety check

    tableBody.innerHTML = ''; 
    incidents.forEach(item => {
        const row = `
            <tr>
                <td>${item.timestamp}</td>
                <td>${item.sensor}</td>
                <td>${item.description}</td>
                <td><span class="status-pill ${item.severity === 'High' ? 'pill-red' : 'pill-yellow'}">${item.severity}</span></td>
                <td><button class="btn-view action-btn" onclick="showEvidence('${item.data_type}')">View</button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function startExam() {
    isExamActive = true;
    document.getElementById('start-container').style.display = 'none';
    document.getElementById('exam-portal').style.display = 'block';
    logToFeed("SESSION START: Monitoring levels elevated.");
}

function logToFeed(message) {
    const feed = document.getElementById('feed');
    if (feed) {
        feed.innerHTML += `<div class="feed-item"><span class="timestamp">[${new Date().toLocaleTimeString()}]</span> ${message}</div>`;
        feed.scrollTop = feed.scrollHeight;
    }
}

// 3. Event Listeners
document.addEventListener('paste', async (e) => {
    if (isExamActive) {
        e.preventDefault();
        const description = "Unauthorized text paste detected.";
        
        const { error } = await supabase.from('incidents').insert([{ 
            timestamp: new Date().toLocaleTimeString(), 
            sensor: '✍️ Typing', 
            description: description, 
            severity: 'Critical',
            data_type: 'typing'
        }]);

        if (!error) {
            alert("Flag Recorded: Suspicious Activity Detected");
            loadIncidents(); 
        }
    }
});

// Initialize
loadIncidents();
async function filterReports() {
    const severity = document.getElementById('severity-filter').value;
    let query = supabase.from('incidents').select('*').order('id', { ascending: false });

    if (severity !== 'all') {
        query = query.eq('severity', severity);
    }

    const { data, error } = await query;
    // ... logic to render 'data' into the #reports-body table
}