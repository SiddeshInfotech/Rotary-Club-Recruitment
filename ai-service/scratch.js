const { generateJSON, initializeAI } = require('./services/aiClient');
require('dotenv').config();

async function test() {
    initializeAI();
    const prompt = `Generate 2 MCQs with options format as requested earlier: { questions: [{ id: 1, dimension: 'leadership', question: 'test', options: [ { id: 'A', text: 'Op A', score: 1 } ] }] }`;
    try {
        const res = await generateJSON(prompt);
        console.log(JSON.stringify(res, null, 2));
    } catch(e) {
        console.error(e);
    }
}
test();
