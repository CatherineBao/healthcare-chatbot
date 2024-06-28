import { processMessageToChatGPT } from '../GPTChatProcessor';

export const handleProcessing = async (message, setProcessingNotification, setProcessing, setQuestion, questionRef, handleSend, setProcessingMessage) => {
  setProcessingNotification(false);
  setProcessing(true);
  setQuestion({ ...questionRef.current, message: message });

  const newMessage = {
    message,
    direction: 'outgoing',
    sender: "user",
    position: "single"
  };

  const systemContent = `
Create a list of additional information, questions, or symptoms that a doctor will ask to create a more accurate diagnosis. These should cover age, gender, race, other symptoms, and relevant details.

When the patient mentions visiting or consulting a doctor, you must ask for any exam results (vitals, blood pressure, temperature, pulse, respiration, etc.).

Here are the areas to cover and DO NOT ask about information that the user has already answered:
Previous Health Issues: Ask about any past health conditions.
Lifestyle: Inquire about smoking, alcohol use, and exercise habits.
Doctor Visits: If the patient mentions a doctor at all, ask for any physical examination or lab results.
Specific Symptoms: Tailor questions to the patient's mentioned symptoms. For example, if a male patient reports urinary problems, ask if it hurts when he pees.
Ensure to follow each topic with a brief description if needed. Aim for short and concise questions.
Example:

Q: I got a cut a few weeks ago and it hasn’t healed yet recently it started hurting more than usual and it looks red on the outside. Should I be concerned?
A: Redness in the area of the wound: Is the redness spreading or forming a red streak? Can you describe the appearance of the redness?^Condition of the wound: Is there swelling, warmth, pain, or tenderness in the area of the cut?^Pus: Is there any pus forming around or oozing from the wound?^Lymph nodes: Do you have swollen lymph nodes in the neck, armpit, or groin?^Other Symptoms: Do you have a fever or other new developments to note?

Respond with only one of the following:

If the question is related to diagnoses (including mental health indications like sadness, depression, anxiety), ask for the user's lifestyle, known statistics (blood pressure, blood sugar, heart rate, temperature, etc.), previous illnesses, and any information from doctor visits. Format the response like this, without a ^ at the end: topic
^topic
Example: Location of pain: Is the pain in one knee or both knees?^Previous injuries: Have you had any previous injuries to your knees?

If the question is unrelated to diagnoses but related to healthcare, or if the inquiry is life-threatening/high risk (e.g., suicide, heart attack symptoms, poison control, stroke symptoms), respond with: %

If the question is unrelated to healthcare, respond with: $

For life-threatening/high-risk diagnosis inquiries, respond with: %

Notes:

Don’t include any additional commentary or formatting outside of specifications.
Don’t repeat points already stated in the original question.
Ask about basic personal information such as age, gender, weight, and race if relevant.
Don't ask for information the user has already provided.
`;


  try {
    const returnMessage = await processMessageToChatGPT([newMessage], systemContent, false);
    console.log(returnMessage);

    if (returnMessage[0] === "$") {
      const unrelatedInquiry = "Respond that you can only help with healthcare-related topics and prompt the user to ask a different question. Do not respond to the user's question. Use a polite and apologetic tone.";
      setProcessingNotification(true);
      handleSend(message, unrelatedInquiry);
      return;
    }
    else if (returnMessage[0] === "%") {
      const nondiagnosesInquiry = "Respond with a literacy that most high school graduates can understand. If the medical inquiry needs immediate attention (suicide, heart attack, stroke, poison, etc.) provide a hotline for the user to call (suicide hotline, poison control, 911, etc.)\n";
      setProcessingNotification(true);
      handleSend(message, nondiagnosesInquiry);
      return;
    }

    const individualQuestions = returnMessage.split("^").map(item => {
      const [label, description] = item.split(":");
      return {
        label: label.trim(),
        description: description.trim(),
        input: ""
      };
    });

    setProcessingNotification(true);
    setProcessing(false);
    setProcessingMessage(individualQuestions);
  } catch (error) {
    console.error("Error processing message:", error);
    setProcessingNotification(true);
    setProcessing(false);
  }
};

export const formatForm = async (event, setProcessing, questionRef, processingMessage, handleSend, setPersonalInfo, chatHistory, setChatHistory) => {
  event.preventDefault();
  setProcessing(true);

  let formattedString = `${questionRef.current.message}\nAdditional Information:\n`;
  
  processingMessage.forEach(({ description, input = '' }) => {
    formattedString += `${description}: ${input}\n`;
  });

  chatHistory += formattedString;
  setChatHistory(chatHistory);

  await checkForPersonalInformation(chatHistory, setPersonalInfo);

  const systemContent = `
    If not enough information is provided from the user and in the chat history, inform the user that more information is needed for an accurate diagnosis and then prompt for more questions for the user to answer to create an accurate diagnosis. Ignore the rest of the instruction below. \n
    If enough specific information is provided from the user, please provide the following information:\n
    1. Provide the most likely diagnosis relating to the user's symptoms. (IMPORTANT)\n
    2. Provide other alternative diagnosis possibilities \n
    3. Provide steps and options to treat the symptoms moving forward including first-aid/home treatment plans and recommending a specialist (include what kind of doctor they should visit)\n
    4. Provide links and websites to other sources where more information about the most likely diagnosis can be found\n
    5. Ask for any follow-up questions involving the user's condition (IMPORTANT)\n
    6. If the medical inquiry needs immediate attention provide a hotline for the user to call (suicide hotline, poison control, 911, etc.) don’t provide any of the information before.\n
    7. Provide more information as needed such as possible medicine options and treatment and safety considerations or other points relevant to the user's question with links to specific pages\n
    \n
    Formatting Instruction: (Use ^ to seperate the sections)\n
    Diagnosis - Diagnosis Title \n
    Information\n^
    Title:\n
    Information\n^
    Title:\n
    Information\n^
    ...\n
    \n
    Example (Refer to the example provided below for formatting and content): \n
    Q: \n
    28M, 168lbs, 6'0. Since last year I've noticed that my body doesn't seem to be healing from injuries that are more than skin deep. I developed a herniated disc two months ago, in November I seemed to have sprained my foot and hand or at least I'm guessing they're sprains based on how I got those injuries((it's been 7 months and they have barely improved). Two weeks ago I developed some kind of swelling behind my knee. I read online that the swelling could be a Baker's Cyst, caused by a knee injury or arthritis(I think it might be an injury from standing on my knee once). I haven't exercised since March to try and give my disc time to recover(not much improvement) so it isn't exercise that could have caused the cyst. Any ideas of what could be the underlying problem?
    Additional Information:\n
    Age: No\n
    Medical History: I have diabetes and I had my appendix out when I was 9\n
    Occupation: I'm a teacher, and I constantly have to bend over and pick up the chalk that children throw at me.\n
    Family History: Not that I know of\n
    Pain and Function: I am not able to bend over as much\n
    A: \n
    Diagnosis - Symptoms caused by Diabetes:\n
    Considering your history of injuries that are not healing properly, along with the development of a herniated disc, foot and hand sprains, and swelling behind your knee, there may be an underlying issue affecting your body's healing capability. One possible explanation for your prolonged recovery and multiple injuries could be related to a systemic condition such as diabetes. Diabetes can impact the body's ability to heal wounds and injuries efficiently, leading to delayed healing and increased susceptibility to injuries.\n
    \n^
    Other Possible Considerations:\n
    Nutritional Deficiencies: Lack of certain vitamins and minerals, such as Vitamin D, calcium, magnesium, and Vitamin C, can impair the body’s ability to heal properly.\n
    Chronic Inflammation: Conditions like chronic inflammation can slow down the healing process. This can be due to autoimmune disorders, chronic infections, or even lifestyle factors such as diet and stress.\n
    Circulatory Issues: Poor circulation can affect healing, as it reduces the supply of necessary nutrients and oxygen to injured areas. Conditions like diabetes or vascular diseases can contribute to this.\n
    Hormonal Imbalances: Hormones play a crucial role in tissue repair. Imbalances in thyroid hormones, cortisol, or testosterone can impair healing.\n
    Infection: Sometimes, an infection in the injured area can cause persistent pain and swelling, preventing proper healing.\n
    \n^
    Home-Treatments:\n
    1. Manage blood sugar levels: Ensure you are actively monitoring and managing your blood sugar levels through proper diet, regular exercise (if approved by your healthcare provider), and any prescribed medications.\n
    2. Support wound healing: Focus on maintaining good wound care practices for any open injuries or wounds to prevent infections and facilitate healing.\n
    3. Modify activities: Consider adjusting your teaching duties to minimize bending over and lifting heavy objects to reduce strain on your body and allow for better recovery.\n
    \n^
    Moving Forward:\n
    Given your history of diabetes and the issues with slow healing and multiple injuries, it is crucial to seek medical evaluation to address these concerns. Proper management of diabetes and appropriate treatment for your current injuries are essential to prevent further complications.\n
    Warning signs to watch out for:\n
    Sudden Energy Crash: Be alert to a sudden drop in energy, which could indicate an underlying issue that needs immediate attention.\n
    Mental Health Changes: Any changes in mood, such as irritability, anxiety, or depression, should be addressed promptly.\n
    Physical Symptoms: New symptoms like palpitations, dizziness, or significant changes in vision or cognition should be evaluated by a healthcare provider immediately.\n
    \n^
    Recommendation for Specialist:\n
    Consulting with a healthcare provider, preferably a primary care physician or an orthopedic specialist, would be beneficial for a comprehensive evaluation of your musculoskeletal issues and consideration of your diabetes. Additionally, you may benefit from a referral to a podiatrist for the foot injury and a rheumatologist to assess the swelling behind your knee in case it is related to arthritis.\n
    \n^
    Additional Notes:\n
    If you require assistance in finding affordable healthcare options, consider reaching out to local clinics, community health centers, or healthcare assistance programs such as...\n
    \n^
    For more information on diabetes and wound healing, you can visit the American Diabetes Association website: https:/ \n
    Do you have any additional questions about your condition?
  `;

  await handleSend(formattedString, systemContent);
};

export const handleSend = async (userMessage, systemContent, messages, setMessages, setTyping) => {
  const newMessage = {
    message: userMessage,
    direction: 'outgoing',
    sender: "user",
    position: "single"
  };

  const newMessages = [...messages, newMessage];
  const appendAndPost = true;

  setMessages(prevMessages => [...prevMessages, newMessage]);

  setTyping(true);
  try {
    const assistantMessage = await processMessageToChatGPT(newMessages, systemContent, appendAndPost);
    assistantMessage.message.split('^').map(part => {
      const splitMessage = {
        message: part, 
        direction: 'incoming',
        sender: 'gipity',
        position: 'single' 
      }
      setMessages(prevMessages => [...prevMessages, splitMessage]);
    });
  } catch (error) {
    console.error("Error sending message:", error);
  } finally {
    setTyping(false);
  }
};

export async function checkForPersonalInformation(chatHistory, setPersonalInfo) {
  const systemContent = `
Instructions: \n
Extract and highlight specific key identifying information of a patient that would be important for medical records that fall under the following categories:\n
1. Basic Identifying Information: Age, Race/Ethnicity, Gender, Weight/Height (BMI), etc.\n
2. Basic Physical Statistics: Blood Pressure, Body Temperature, Heart Rate, Blood Sugar Levels, etc. \n
3. Physical Observations: Skin Color, Lesions, Hygienic Issues, Unusual Lumps, Bruises, etc. \n
4. Test Results: X-ray, CT, MRI, EKG, Eye Exam, etc. \n
5. Medical History: Procedures, Immunizations, Allergies, Chronic Illnesses, Medications, Previous Diagnoses, etc. \n
6. Life Style: Exercise, Diet, Alcohol, Tabacco, Drugs, Sleep\n
7. Additional notes and comments as applicable\n
Notes: Do not include questions as key identifying information such as: "Have you had any previous injuries or surgeries on your knees?". \n
\n
Formatting: \n
Section Title 1*Section Item*Section Item*Last Section Item:Section Title 2*Section Item*Section Item*Last Section Item:Section Title 3*Section Item*Last Section Item\n
Basic Identifying Information*Age-16*Gender-F*Ethnicity-Asian:Basic Health Stats*Blood Type-O*Blood Pressure-120/80*Body Temperature-98c:Notes*No comments about any physical conditions\n
\n
Example:\n
Q: I am a 57yo male 62 154 lbs. I have been without insurance for 2.5 years now. I have been out of my blood pressure medicine for 2 years now. My blood pressure runs around 200/105. 2 years ago I took an international flight. When i got off of a 12 hour flight my left calf stopped working. If I walk at my normal pace I can only make it about Then I spent another 24 hours or so in the back seat of a Toyota high ace van. which has even less room to move.If I walk at my normal pace I can only make it about 30 yards before it starts to feel swollen and tight and then the pain starts. Now after 2 years of not being able to walk both of my legs hurt all the time and I can barely walk for the first 2 hours of the day. I have a customer where I work, She is a nutritionist. She says that I am "severely malnourished" I suspect that I won"t make it to Christmas. Any Ideas?\n
A: Basic Identifying Information*Age-57*Gender-M*Weight-154lb:Basic health States*Blood Pressure-200/105:Life Style* Can barely walk for the first 2 hours of the day:Medical Hsitory*Severely Malnourished:Notes*No information on specific activities or movements worsening the pain* No information on swelling or redness around the legs*No information on previous blood preasure issues
  `;

  const newMessage = {
    message: chatHistory,
    direction: 'outgoing',
    sender: "user",
    position: "single"
  };

  try {
    const updatedPersonalInfo = await processMessageToChatGPT([newMessage], systemContent, false);

    const personalInfoArray = updatedPersonalInfo.split(':').map(part => {
      const [topic, ...info] = part.split('*');
      const filteredInfo = info.map(item => item.trim()).filter(item => item !== '');
      return {
        Topic: topic.trim(),
        Info: filteredInfo
      };
    });
    console.log(personalInfoArray);
    setPersonalInfo(personalInfoArray);
  } catch (error) {
    console.error("Error checking personal information:", error);
  }
}