import json
import os

def update_twin_data():
    survey_file = 'survey_responses.json'
    override_file = 'settings_override.json'
    
    if not os.path.exists(survey_file):
        print(f"Error: {survey_file} not found.")
        return
        
    try:
        with open(survey_file, 'r', encoding='utf-8') as f:
            responses = json.load(f)
    except Exception as e:
        print(f"Error reading survey responses: {e}")
        return

    # Load existing overrides if any
    overrides = {}
    if os.path.exists(override_file):
        try:
            with open(override_file, 'r', encoding='utf-8') as f:
                overrides = json.load(f)
        except Exception:
            overrides = {}

    # Map survey answers to task status in the dashboard
    # Default tasks list matching app.js defaults:
    # 0: إزالة أشجار الموالح بالكامل في حواش 1A و 3A للبدء في مشروع التكثيف
    # 1: أعمال الصيانة الطارئة والعاجلة لشبكة ري أشجار المانجو (أحواض 1B و 2B و 4)
    # 2: إنشاء وتشييد خزانات المياه ومحطة الفلترة الرئيسية وطلب عروض أسعار التوريد (RFQs)
    # 3: تعديل أسعار دراسة دورة التسمين وتجهيز عنابر الخرفان للبدء الفعلي
    # 4: التعاقد على فسائل النخيل البرحي وشتلات الروزماري وتجهيز الخطوط دون الحاجة لتسوية بالليزر

    maint_tasks = [
        { "text": "إزالة أشجار الموالح بالكامل في حواش 1A و 3A للبدء في مشروع التكثيف", "status": "success" },
        { "text": "أعمال الصيانة الطارئة والعاجلة لشبكة ري أشجار المانجو (أحواض 1B و 2B و 4)", "status": "critical" },
        { "text": "إنشاء وتشييد خزانات المياه ومحطة الفلترة الرئيسية وطلب عروض أسعار التوريد (RFQs)", "status": "inprogress" },
        { "text": "تعديل أسعار دراسة دورة التسمين وتجهيز عنابر الخرفان للبدء الفعلي", "status": "inprogress" },
        { "text": "التعاقد على فسائل النخيل البرحي وشتلات الروزماري وتجهيز الخطوط دون الحاجة لتسوية بالليزر", "status": "scheduled" }
    ]

    # 1. Citrus removal
    citrus_ans = responses.get("إزالة الموالح", "")
    if "نعم" in citrus_ans or "بالكامل" in citrus_ans:
        maint_tasks[0]["status"] = "success"
    elif "جاري" in citrus_ans:
        maint_tasks[0]["status"] = "inprogress"
    else:
        maint_tasks[0]["status"] = "scheduled"

    # 2. Mango irrigation status
    mango_ans = responses.get("أشجار المانجو", "")
    if "الانتهاء" in mango_ans or "ممتازة" in mango_ans:
        maint_tasks[1]["status"] = "success"
    elif "جاري" in mango_ans:
        maint_tasks[1]["status"] = "inprogress"
    elif "تدخل عاجل" in mango_ans or "عاجل" in mango_ans:
        maint_tasks[1]["status"] = "critical"

    # 3. Reservoirs and filtration status
    reservoirs_ans = responses.get("كفاءة الخزانات والفلترة", "")
    if "نعم" in reservoirs_ans or "بكفاءة" in reservoirs_ans:
        maint_tasks[2]["status"] = "success"
    elif "صيانة" in reservoirs_ans or "أعطال" in reservoirs_ans:
        maint_tasks[2]["status"] = "inprogress"

    # 4. Sheep count and fattening cycle
    sheep_count = 0
    try:
        sheep_count = int(responses.get("عدد خرفان التسمين", 0))
    except (ValueError, TypeError):
        pass

    sheep_ans = responses.get("حالة دورة التسمين", "")
    if sheep_count > 0:
        if "مستقرة" in sheep_ans:
            maint_tasks[3]["status"] = "success"
        else:
            maint_tasks[3]["status"] = "inprogress"
    else:
        maint_tasks[3]["status"] = "inprogress"

    # 5. Soil prep & intercropping contracts
    soil_ans = responses.get("حرث وتجهيز التربة", "")
    palm_ans = responses.get("فسائل النخيل البرحي", "")
    rosemary_ans = responses.get("شتلات الروزماري", "")
    irr_status = responses.get("تنفيذ شبكة الري المزدوجة", "")

    if "الانتهاء" in soil_ans and "زراعتها" in palm_ans and "زراعتها" in rosemary_ans and "التنفيذ" in irr_status:
        maint_tasks[4]["status"] = "success"
    elif "جاري" in soil_ans or "جاري" in palm_ans or "جاري" in rosemary_ans or "جاري" in irr_status:
        maint_tasks[4]["status"] = "inprogress"
    else:
        maint_tasks[4]["status"] = "scheduled"

    # Save to overrides
    overrides["maintTasks"] = maint_tasks
    overrides["surveyResponses"] = responses
    overrides["sheepCount"] = sheep_count
    
    # Store sheep count and any extra parameters in overrides if dashboard needs them
    # Let's say if we want to display the sheep count or other values dynamically
    
    with open(override_file, 'w', encoding='utf-8') as f:
        json.dump(overrides, f, ensure_ascii=False, indent=4)
        
    print("Digital twin settings override written successfully.")

if __name__ == '__main__':
    update_twin_data()
