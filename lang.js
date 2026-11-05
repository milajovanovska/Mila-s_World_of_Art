(function () {
    const STORAGE_KEY = 'lang';
    const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
    const ATTR_SELECTOR = '[placeholder],[aria-label],[title],[alt]';
    const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA']);

    const PAIRS = [
            [`Home`, `Почетна`],
            [`About Me`, `За мене`],
            [`Paintings`, `Уметнички дела`],
            [`Exhibition`, `Изложба`],
            [`Merch`, `Колекција`],
            [`Contact`, `Контакт`],
            [`Mila Jovanovska`, `Мила Јовановска`],
            [`artist`, `уметница`],
            [`Step into my creative world, where colors come alive and code sparks innovation uniting my love for art and IT`, `Добредојдовте во мојот креативен свет, каде што уметноста и технологијата се спојуваат, а боите и кодот ја раскажуваат мојата приказна.`],
            [`"Great things are not done by impulse, but by a series of small things brought together."`, `„Големите нешта не настануваат одеднаш, туку се создаваат со спојување на многу мали нешта.“`],
            [`- Vincent Van Gogh`, `— Винсент ван Гог`],
            [`| All rights reserved.`, `| Сите права се задржани.`],
            [`© 2025 Mila Jovanovska. All rights reserved.`, `© 2025 Мила Јовановска. Сите права се задржани.`],
            [`Change theme`, `Промени тема`],
            [`Mila's World of Art home`, `Почетна страница – Mila's World of Art`],
            [`Toggle menu`, `Отвори/затвори мени`],
            [`Close`, `Затвори`],
            [`Exhibitions`, `Изложби`],
            [`Contact Me`, `Контактирајте ме`],

            [`My Starting Journey: From a Child's Dream to Reality and My Everyday Lifestyle`, `Мојот пат: од детски сон до реалност`],
            [`Hi, I'm Mila Jovanovska, a 20 year old from Skopje, North Macedonia. I've always been a dedicated student, winning awards and participating in competitions in math, arts, and languages. I'm currently pursuing my undergraduate studies at the Faculty of Computer Science and Engineering at UKIM.`, `Здраво, јас сум Мила Јовановска, имам 20 години и доаѓам од Скопје. Уште од училишните денови сум посветена на учењето, а учествував и на натпревари по математика, уметност и јазици, на кои освоив повеќе награди. Моментално студирам на Факултетот за информатички науки и компјутерско инженерство (ФИНКИ) при УКИМ.`],
            [`Art has always played a big role in my life. I started with crafts like origami and clay, but painting became my true passion. Over the past few years, I've been attending painting sessions with a professional artist, where I've learned important techniques and grown both artistically and personally.`, `Уметноста отсекогаш била важен дел од мојот живот. Најпрво се занимавав со ракотворби, како оригами и изработка со глина, но со текот на времето сликањето стана мојата најголема страст. Во изминативе неколку години посетувам часови по сликање кај професионален уметник, каде што ги усовршувам своите техники и напредувам и како уметник и како личност.`],
            [`Today, I'm focused on combining art with technology. I believe my creativity and communication skills are valuable assets, and I'm motivated to keep learning, improving, and expressing myself through both code and canvas.`, `Денес сакам да ги поврзам уметноста и технологијата. Креативноста и способноста за комуникација ги сметам за свои силни страни, а ме мотивира постојано да учам, да се усовршувам и да се изразувам и преку кодот и преку сликарството.`],
            [`In 2024, I fulfilled a childhood dream by organizing my first solo exhibition, "Happiness, Joy, Step Forward". It was a deeply meaningful experience of growth and creative expression - you can read about it`, `Во 2024 година остварив еден детски сон – ја организирав својата прва самостојна изложба, „Среќа, радост, чекор напред“. Тоа беше посебно и значајно искуство за мене, а повеќе за изложбата можете да прочитате`],
            [`here`, `тука`],
            [`The same year, I launched a limited-edition unisex`, `Истата година претставив и ограничена унисекс колекција на`],
            [`t-shirt`, `маици`],
            [`line featuring my original artwork. Each shirt included a print of one of my paintings on the back. The collection was sold both online and at Concept 37, Skopje.`, `со мои авторски дела. На задната страна на секоја маица беше отпечатена една од моите слики. Колекцијата се продаваше онлајн, како и во Concept 37 во Скопје.`],
            [`I'm incredibly grateful for the support and the warm feedback the project received.`, `Особено сум благодарна за поддршката и убавите реакции што ги доби проектот.`],

            [`The Art of Becoming: My First Solo Exhibition`, `Мојата прва самостојна изложба`],
            [`On March 6th, 2024, I held my first solo exhibition at Concept 37 in Skopje - a cozy, creative space that truly matched the emotion behind my work. The exhibition featured 21 art pieces, each created with a deeply personal narrative and emotional intensity. What truly amazed me was the overwhelming interest - a large portion of the artworks were sold, which for a debut show felt both surreal and affirming. I'm also incredibly grateful for the strong media support the exhibition received - it played a huge role in helping people discover my work. It meant so much when strangers began to recognize me, stop me on the street, and offer kind words and congratulations.`, `На 6 март 2024 година ја отворив својата прва самостојна изложба во Concept 37 во Скопје – креативен и пријатен простор кој одлично се вклопи со атмосферата на моите дела. Беа изложени 21 слика, а секоја од нив носеше лична приказна и посебна емоција. Интересот на посетителите пријатно ме изненади: голем дел од делата најдоа свои купувачи, што за мојата прва изложба беше навистина посебно чувство. Благодарна сум и за медиумската поддршка, благодарение на која мојата работа допре до поширока публика. Особено ми значеше кога луѓе што дотогаш не ме познаваа почнаа да ме препознаваат, да ме запираат на улица и да ми упатуваат убави зборови и честитки.`],
            [`Interviews`, `Медиумски гостувања`],
            [`Watch now`, `Погледнете`],
            [`Read now`, `Прочитајте`],
            [`Over the course of two months, the exhibition was visited by an impressive number of people - art lovers, collectors, friends, and strangers - all of whom brought their own interpretations and feelings to the work. What touched me most was witnessing how deeply people connected with the art, often lingering in front of certain pieces, sometimes even returning more than once. It was a humbling reminder of the quiet power that visual storytelling can hold.I dedicated the exhibition to my grandfather, who always believed in me and guided my artistic journey.`, `Во текот на двата месеца, изложбата ја посетија многу луѓе – љубители на уметноста, колекционери, пријатели, но и посетители што првпат се среќаваа со мојата работа. Секој од нив ги доживеа делата на свој начин. Најмногу ме трогна тоа што некои посетители долго застануваа пред одредени слики, а дел од нив се враќаа повторно. Тоа ми покажа колку силно едно уметничко дело може да допре до човекот и без многу зборови. Изложбата му ја посветив на мојот дедо, кој секогаш веруваше во мене и ме поддржуваше на мојот уметнички пат.`],
            [`Since then, I've continued participating in group exhibitions across Skopje and the country - sharing, learning, and growing with each new step.`, `До тогаш, а и потоа, имам учествувано и на повеќе групни изложби низ Скопје и земјата, каде што продолжив да ги споделувам своите дела, да учам и да стекнувам нови искуства и пријателства.`],

            [`From Canvas to Wearable Art`, `Од уметничко платно до дизајн што се носи`],
            [`Both Sides`, `Предна и задна страна`],
            [`Detail- Front View`, `Детал од предната страна`],
            [`Back View`, `Задна страна`],
            [`As a part-time artist, I've also ventured into t-shirt design, and I must say, I'm absolutely thrilled with how they turned out. My artwork and creative brand can now be part of your everyday style!`, `Покрај сликањето, се испробав и во дизајнирање маици. Презадоволна сум од конечниот изглед и од тоа што моите уметнички дела сега можат да станат дел од нечиј секојдневен стил!`],
            [`The design process was challenging yet incredibly interesting and inspiring, and I'm so satisfied with how the t-shirts came to life. This limited edition unisex t-shirt is unique and exceptional, combining art with everyday fashion.`, `Работата на дизајнот беше вистински предизвик, но и многу интересно и инспиративно искуство. Задоволна сум од тоа како изгледаат маиците. Оваа ограничена унисекс колекција ја спојува уметноста со секојдневната облека и му дава посебен печат на секојдневниот стил.`],
            [`After three limited preorder editions, the collection is now`, `По три ограничени изданија достапни за прет, колекцијата сега е`],
            [`completely sold out`, `целосно распродадена`],
            [`. I'm incredibly grateful for everyone who supported my work and made this project such a success.`, `. Искрено им благодарам на сите што ја поддржаа мојата работа и придонесоа за успехот на овој проект.`],
            [`A brand-new collection with fresh artwork and a completely new design is already in the works, so stay tuned for future releases.`, `Веќе подготвувам нова колекција со досега необјавени дела и поинаков дизајн. Наскоро следуваат повеќе новости.`],
            [`The artwork on the back of the shirt is a painting I created on canvas, and it's also the first sold piece from my exhibition.`, `Сликата отпечатена на задната страна од маицата најпрво ја насликав на платно. Тоа е и првото дело продадено од мојата изложба.`],
            [`For any questions and orders, feel free to send me a direct message on my`, `За прашања или нарачки, можете да ми испратите порака преку`],
            [`or`, `или на`],
            [`Email`, `Е-пошта`],
            [`I hope you enjoy wearing this unique piece and wear it with pride!`, `Се надевам дека ќе уживате во ова уникатно парче и со задоволство ќе го носите!`],
            [`Both Stickers`, `Двете налепници`],
            [`In addition to the t-shirts, I've designed two custom stickers which are another form of wearable art for your favorite belongings.`, `Покрај маиците, дизајнирав и два дизајни на стикерчиња со авторски мотиви – мал уметнички детал за вашите омилени предмети.`],

            [`Have a painting in mind?`, `Барате слика по ваша желба?`],
            [`Whether you've found a piece you love, have a question about an artwork, or have an idea of your own - tell me about it.`, `Без разлика дали ви се допаднала некоја од моите слики, имате прашање за одредено дело или сакате да споделите своја идеја – пишете ми.`],
            [`Start a conversation`, `Контактирајте ме`],
            [`Note:`, `Важно:`],
            [`Alongside my original pieces, I also create artworks influenced by ideas or compositions from other artists -`, `Покрај авторските дела, понекогаш создавам и слики инспирирани од идеи или композиции на други уметници. Притоа,`],
            [`never by copying them entirely, but by using them as a starting point for something new. Every painting I share contains elements that reflect my perspective, creativity, and story.`, `не ги копирам туѓите дела, туку ги земам како почетна инспирација за создавање нешто свое. Во секоја слика внесувам дел од сопствениот поглед, креативност и лична приказна.`],
            [`Thank you for your understanding and support!`, `Ви благодарам за разбирањето и поддршката!`],
            [`Let's stay in touch`, `Да останеме во контакт`],
            [`Email:`, `Е-пошта:`],
            [`How can I help?`, `Како можам да ви помогнам?`],
            [`Pick what fits best & I'll take it from there.`, `Одберете што ве интересира, а јас ќе ви одговорам соодветно.`],
            [`Ask about an artwork`, `Прашање за уметничко дело`],
            [`Questions about a piece you've seen`, `Имате прашање за некоја од изложените слики`],
            [`Tell me your idea`, `Споделете ја вашата идеја`],
            [`Share a concept you have in mind`, `Опишете што имате замислено`],
            [`Request this artwork`, `Побарајте го ова дело`],
            [`Ask about buying or reserving a piece`, `Прашајте за купување или резервација на дело`],
            [`See an artwork in my space`, `Проверете како би изгледала сликата во вашиот простор`],
            [`Coming soon`, `Наскоро`],
            [`This feature is currently in progress. Soon you'll be able to see how an artwork would look on your wall.`, `Оваа функционалност е во изработка. Наскоро ќе можете да видите како би изгледала сликата на вашиот ѕид.`],
            [`Find out how a piece could look at home`, `Погледнете како би се вклопило делото во вашиот дом`],
            [`Back`, `Назад`],
            [`Your name`, `Име и презиме`],
            [`Your email`, `Вашата е-пошта`],
            [`Your message`, `Вашата порака`],
            [`Send message`, `Испрати порака`],
            [`Describe the piece you have in mind`, `Опишете каква слика барате`],
            [`Describe the artwork`, `Опишете го делото`],
            [`Preferred colors`, `Бои што ги посакувате`],
            [`Mood`, `Атмосфера`],
            [`Subject or theme (optional)`, `Мотив или тема (не е задолжително)`],
            [`Approximate dimensions (in cm)`, `Приближни димензии (во cm)`],
            [`Intended room or space`, `Каде планирате да го поставите делото?`],
            [`Additional notes (optional)`, `Дополнителни информации (не е задолжително)`],
            [`Reference image (optional)`, `Пример-слика (не е задолжително)`],
            [`A reference image is inspiration only. It won't be reproduced exactly.`, `Пример-сликата служи само како инспирација и нема да биде пресликана во целост.`],
            [`Send idea`, `Испрати идеја`],
            [`Message sent`, `Пораката е испратена`],
            [`Thank you! I'll get back to you soon.`, `Ви благодарам! Ќе ви одговорам во најскоро време.`],
            [`e.g. 50x70cm`, `на пр. 50x70 cm`],
            [`Please use the format numberXnumber in cm, e.g. 50x70cm`, `Внесете ги димензиите во формат број x број, во cm (на пр. 50x70 cm).`],
            [`e.g. living room, bedroom, office`, `на пр. дневна соба, спална соба, работна соба`],
            [`Anything else you'd like me to know`, `Дали има нешто друго што би сакале да го знам?`],

            [`Sold`, `Продадено`],
            [`Available`, `Достапно`],
            [`Reserved`, `Резервирано`],
            [`Details`, `Повеќе детали`],
            [`Artwork`, `Уметничко дело`],
            [`Status`, `Достапност`],
            [`Technique`, `Техника`],
            [`Dimensions`, `Димензии`],
            [`Price`, `Цена`],
            [`Oil`, `Масло на платно`],
            [`Acrylic`, `Акрил`],
            [`On request`, `По договор`],
            [`Request this artwork or ask for more details`, `Прашајте за ова дело или побарајте дополнителни информации`],
            [`Message (optional)`, `Порака (не е задолжително)`],
            [`Send inquiry`, `Испрати прашање`],
            [`Inquiry sent`, `Прашањето е испратено`],
            [`Thank you, I will get back to you soon.`, `Ви благодарам! Ќе ви одговорам наскоро.`],

            [`Sending...`, `Се испраќа...`],
            [`Uploading image...`, `Сликата се прикачува...`],
            [`Please fill in all required fields before sending.`, `Пополнете ги задолжителните полиња пред да ја испратите пораката.`],
            [`Please confirm the "I am not a robot" checkbox before sending.`, `Потврдете дека не сте робот со означување на соодветното поле.`],
            [`The security check did not load. Please refresh the page and try again.`, `Безбедносната проверка не се вчита. Освежете ја страницата и обидете се повторно.`],
            [`The email service did not load. Please refresh the page and try again.`, `Услугата за испраќање е-пошта не се вчита. Освежете ја страницата и обидете се повторно.`],
            [`Something went wrong sending your inquiry. Please try again, or email me directly at milasworldofart@yahoo.com.`, `При испраќањето на прашањето настана грешка. Обидете се повторно или пишете ми директно на milasworldofart@yahoo.com.`],
            [`Something went wrong sending your idea. Please try again, or email me directly at milasworldofart@yahoo.com.`, `При испраќањето на идејата настана грешка. Обидете се повторно или пишете ми директно на milasworldofart@yahoo.com.`],
            [`Something went wrong sending your message. Please try again, or email me directly at milasworldofart@yahoo.com.`, `При испраќањето на пораката настана грешка. Обидете се повторно или пишете ми директно на milasworldofart@yahoo.com.`],
            [`The security check expired. Please tick the box again.`, `Безбедносната проверка истече. Означете го полето повторно.`],
            [`The security check lost its connection. Check your internet connection, then tick the box again.`, `Врската со безбедносната проверка беше прекината. Проверете ја интернет-врската и означете го полето повторно.`],
            [`The security check did not load. An ad blocker, a privacy setting or your connection may be blocking google.com/recaptcha. Allow it and reload the page.`, `Безбедносната проверка не се вчита. Можно е блокатор на реклами, поставките за приватност или интернет-врската да го блокираат google.com/recaptcha. Дозволете пристап и потоа освежете ја страницата.`],
            [`reCAPTCHA does not work when the page is opened as a file. Open it through the browser icon in WebStorm (localhost) or the live website.`, `reCAPTCHA не работи ако страницата ја отворите директно како датотека. Отворете ја преку иконата за прелистувач во WebStorm (localhost) или преку објавената веб-страница.`]
        ]
    ;

    const dict = new Map();
    const textRecords = new WeakMap();
    const attrRecords = new WeakMap();
    const titleRecord = {orig: document.title, tr: null};

    function norm(s) {
        return String(s)
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/[\u201C\u201D]/g, '"')
            .replace(/[\u2013\u2014]/g, '-')
            .replace(/\u00a0/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    PAIRS.forEach(function (pair) {
        dict.set(norm(pair[0]), pair[1]);
    });

    function readLang() {
        try {
            return localStorage.getItem(STORAGE_KEY) === 'mk' ? 'mk' : 'en';
        } catch (err) {
            return 'en';
        }
    }

    function saveLang(lang) {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (err) {
            return;
        }
    }

    let current = readLang();
    let switchBtn = null;

    function lookup(text) {
        return dict.get(norm(text));
    }

    function translateString(text) {
        if (current !== 'mk') return text;
        return lookup(text) || text;
    }

    function shouldSkip(node) {
        const parent = node.parentElement;
        if (!parent) return true;
        if (SKIP_TAGS.has(parent.tagName)) return true;
        return !!parent.closest('.lang-switch');
    }

    function processText(node) {
        if (shouldSkip(node)) return;

        let rec = textRecords.get(node);
        if (!rec) {
            rec = {orig: node.nodeValue, tr: null};
            textRecords.set(node, rec);
        } else if (node.nodeValue !== rec.orig && node.nodeValue !== rec.tr) {
            rec.orig = node.nodeValue;
            rec.tr = null;
        }

        let target = rec.orig;
        if (current === 'mk') {
            const tr = lookup(rec.orig);
            if (tr) {
                const lead = rec.orig.match(/^\s*/)[0];
                const trail = rec.orig.match(/\s*$/)[0];
                rec.tr = lead + tr + trail;
                target = rec.tr;
            }
        }

        if (node.nodeValue !== target) node.nodeValue = target;
    }

    function processAttributes(root) {
        const elements = [];
        if (root.matches && root.matches(ATTR_SELECTOR)) elements.push(root);
        root.querySelectorAll(ATTR_SELECTOR).forEach(function (el) {
            elements.push(el);
        });

        elements.forEach(function (el) {
            if (el.closest('.lang-switch')) return;

            let rec = attrRecords.get(el);
            if (!rec) {
                rec = {};
                attrRecords.set(el, rec);
            }

            ATTRS.forEach(function (attr) {
                if (!el.hasAttribute(attr)) return;

                const value = el.getAttribute(attr);
                let r = rec[attr];
                if (!r) {
                    r = {orig: value, tr: null};
                    rec[attr] = r;
                } else if (value !== r.orig && value !== r.tr) {
                    r.orig = value;
                    r.tr = null;
                }

                let target = r.orig;
                if (current === 'mk') {
                    const tr = lookup(r.orig);
                    if (tr) {
                        r.tr = tr;
                        target = tr;
                    }
                }

                if (value !== target) el.setAttribute(attr, target);
            });
        });
    }

    function processTree(root) {
        if (root.nodeType === Node.TEXT_NODE) {
            processText(root);
            return;
        }
        if (root.nodeType !== Node.ELEMENT_NODE) return;

        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while (node) {
            processText(node);
            node = walker.nextNode();
        }
        processAttributes(root);
    }

    function processTitle() {
        let target = titleRecord.orig;
        if (current === 'mk') {
            const tr = lookup(titleRecord.orig);
            if (tr) {
                titleRecord.tr = tr;
                target = tr;
            }
        }
        if (document.title !== target) document.title = target;
    }

    function updateSwitch() {
        if (!switchBtn) return;
        const toMk = current === 'en';
        switchBtn.textContent = toMk ? 'Мк' : 'En';
        switchBtn.lang = toMk ? 'mk' : 'en';
        const label = toMk ? 'Префрли на македонски' : 'Префрли на англиски';
        switchBtn.setAttribute('aria-label', label);
        switchBtn.setAttribute('title', label);
    }

    function applyLanguage() {
        document.documentElement.lang = current === 'mk' ? 'mk' : 'en';
        processTree(document.body);
        processTitle();
        updateSwitch();
    }

    function setLanguage(lang) {
        current = lang === 'mk' ? 'mk' : 'en';
        saveLang(current);
        applyLanguage();
        document.dispatchEvent(new CustomEvent('languagechange', {detail: current}));
    }

    function createSwitch() {
        const holder = document.querySelector('.nav-links');
        if (!holder) return;

        switchBtn = document.createElement('button');
        switchBtn.type = 'button';
        switchBtn.className = 'lang-switch';
        switchBtn.addEventListener('click', function () {
            setLanguage(current === 'en' ? 'mk' : 'en');
        });
        holder.appendChild(switchBtn);
    }

    const nativeAlert = window.alert.bind(window);
    window.alert = function (message) {
        nativeAlert(translateString(String(message)));
    };

    window.I18N = {
        t: translateString,
        lang: function () {
            return current;
        },
        set: setLanguage
    };

    function init() {
        createSwitch();
        applyLanguage();

        const observer = new MutationObserver(function (mutations) {
            if (current !== 'mk') return;
            mutations.forEach(function (m) {
                if (m.type === 'characterData') {
                    processText(m.target);
                } else {
                    m.addedNodes.forEach(processTree);
                }
            });
        });
        observer.observe(document.body, {childList: true, subtree: true, characterData: true});
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();