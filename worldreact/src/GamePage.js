import React, {useEffect} from "react";
import {
    Vector3,
    HemisphericLight,
    SceneLoader,
    ArcRotateCamera,
    ActionManager,
    ExecuteCodeAction
} from "@babylonjs/core";
import '@babylonjs/loaders';
import * as GUI from 'babylonjs-gui';
import SceneComponent from "./SceneComponent";
import "./GamePage.css";
import axios from 'axios';
import {useCookies} from 'react-cookie';
let jalaali = require('jalaali-js');

export default() => {
    // **** شروع متغیر های لازم در سراسر بازی ****
    let inputMap = {};
    let cameraAlpha = Math.PI / 2 - 0.5934119449999999;
    let camera;
    // let serverAdrs = `http://localhost`;
    let controlRects = [];
    // let joystick;
    let serverAdrs = `http://185.208.79.40`;
    const [cookies, setCookie] = useCookies();
    // **** پایان متغیر های لازم در سراسر بازی **** **** شروع بارگذاری صحنه بازی
    // ****
    const onSceneReady = (scene, engine) => {
        camera = new ArcRotateCamera("camera1", 0, 0, 0, new Vector3(0, 0, 0), scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl();
        camera.angularSensibilityX = 550;
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        const canvas = scene
            .getEngine()
            .getRenderingCanvas();
        SceneLoader
            .ImportMeshAsync("", "/", "character.glb", scene)
            .then((result2) => {
                const character = result2.meshes[0];
                scene
                    .getMeshByName("charcol")
                    .isVisible = false;
                SceneLoader
                    .ImportMeshAsync("", "/", "vworld-mofid-inside-room.glb", scene)
                    .then((result3) => {
                        let cameraTargetPosition = Vector3.Lerp(
                            Vector3.Zero(),
                            new Vector3(character.position.x, character.position.y + 5, character.position.z),
                            0.4
                        );
                        camera.setTarget(cameraTargetPosition);
                        const standingAnim = scene.getAnimationGroupByName("standing");
                        const walkingAnim = scene.getAnimationGroupByName("walking");
                        character.rotate(new Vector3(0, 1, 0), Math.PI + 0.5934119449999999)
                        camera.alpha = Math.PI / 2 - 0.5934119449999999;
                        camera.radius = 2;
                        camera.setTarget(cameraTargetPosition);
                        camera.beta = Math.PI / 2.5;
                        // **** شروع نمایش کلید های حرکتی ****
                        const advancedTexture6 = GUI
                            .AdvancedDynamicTexture
                            .CreateFullscreenUI("myUI", scene);
                        controlRects[0] = new GUI.Image("image2", "./up-arrow.png");
                        controlRects[0].height = "80px";
                        controlRects[0].width = "80px";
                        controlRects[0].topInPixels = 245;
                        controlRects[0].leftInPixels = 70;
                        controlRects[0]
                            .onPointerDownObservable
                            .add(() => {
                                inputMap['w'] = true;
                            });
                        controlRects[0]
                            .onPointerUpObservable
                            .add(() => {
                                inputMap['w'] = false;
                                walkingAnim.stop();
                                standingAnim.start(true, 0.1, walkingAnim.from, walkingAnim.to, false);
                            });
                        advancedTexture6.addControl(controlRects[0]);
                        // let rect6 = new GUI.Image("image3", "./left-arrow.png"); rect6.height =
                        // "80px"; rect6.width = "80px"; rect6.topInPixels = 260; rect6.leftInPixels =
                        // -160; rect6     .onPointerDownObservable     .add(() => {
                        // inputMap['a'] = true;     }); rect6     .onPointerUpObservable     .add(() =>
                        // {         inputMap['a'] = false;     }); advancedTexture6.addControl(rect6);
                        // let rect7 = new GUI.Image("image4", "./right-arrow.png"); rect7.height =
                        // "80px"; rect7.width = "80px"; rect7.topInPixels = 260; rect7.leftInPixels =
                        // -80; rect7     .onPointerDownObservable     .add(() => {
                        // inputMap['d'] = true;     }); rect7     .onPointerUpObservable     .add(() =>
                        // {         inputMap['d'] = false;     }); advancedTexture6.addControl(rect7);
                        // let rect8 = new GUI.Image("image5", "./down-arrow.png"); rect8.height =
                        // "80px"; rect8.width = "80px"; rect8.topInPixels = 310; rect8.leftInPixels =
                        // 110; rect8     .onPointerDownObservable     .add(() => {
                        // inputMap['s'] = true;     }); rect8     .onPointerUpObservable     .add(() =>
                        // {         inputMap['s'] = false;         walkingAnim.stop();
                        // standingAnim.start(true, 0.1, walkingAnim.from, walkingAnim.to, false);
                        // }); advancedTexture6.addControl(rect8);
                        controlRects[1] = new GUI.Image("image5", "./shortcut.png");
                        controlRects[1].height = "80px";
                        controlRects[1].width = "80px";
                        controlRects[1].topInPixels = -360;
                        controlRects[1].leftInPixels = -170;
                        // **** شروع نمایش تبلت با کلید شرتکات ****
                        controlRects[1]
                            .onPointerDownObservable
                            .add(() => {
                                controlRects[0].topInPixels = 1000;
                                controlRects[1].topInPixels = 1000;
                                const advancedTexture2 = GUI
                                    .AdvancedDynamicTexture
                                    .CreateFullscreenUI("myUI", scene);
                                let rect4 = new GUI.Rectangle();
                                rect4.cornerRadius = 20;
                                rect4.height = "659px";
                                rect4.width = "360px";
                                rect4.color = "Orange";
                                rect4.thickness = 4;
                                rect4.background = "white";
                                rect4.isPointerBlocker = true;
                                advancedTexture2.addControl(rect4);
                                let image = new GUI.Image("image1", "./close.png");
                                image.width = "50px";
                                image.height = "50px";
                                image.topInPixels = -300;
                                image.leftInPixels = 150
                                let rect2Obs = image
                                    .onPointerClickObservable
                                    .add(() => {
                                        advancedTexture2.dispose();
                                        controlRects[0].topInPixels = 245;
                                        controlRects[1].topInPixels = -360;
                                    });
                                rect4.addControl(image);
                                let text1 = new GUI.TextBlock();
                                text1.text = "اسم کاری که میخوای بهش مشغول شی رو انتخاب کن\nو شروع کن";
                                text1.color = "black";
                                text1.topInPixels = -70;
                                text1.fontSize = 18;
                                text1.height = "180px"
                                rect4.addControl(text1);
                                let input = new GUI.InputText();
                                input.maxWidth = "340px";
                                input.height = "40px";
                                input.color = "black";
                                input.background = "orange";
                                input.placeholderText = "اسم کارتو اینجا بنویس";
                                input.placeholderColor = "black";
                                input.focusedBackground = "orange";
                                input.autoStretchWidth = true;
                                rect4.addControl(input);
                                let rect9 = new GUI.Rectangle();
                                rect9.cornerRadius = 5;
                                rect9.height = "40px";
                                rect9.width = "250px";
                                rect9.topInPixels = 70;
                                rect9.color = "Orange";
                                rect9.thickness = 4;
                                rect9.background = "orange";
                                rect9.onPointerClickObservable.add(()=>{
                                    let paramsToSend = new URLSearchParams();
                                    paramsToSend.append("user", cookies.user);
                                    axios
                                        .get(serverAdrs + `/getJobs?` + paramsToSend.toString())
                                        .then(res => {
                                            let tasks = res.data;
                                            let i = 0;
                                            let rect10 = new GUI.ScrollViewer();
                                            rect10.width = "280px";
                                            if (Object.keys(tasks).length < 6) {
                                                rect10.heightInPixels =Object.keys(tasks).length * 52
                                            }
                                            else {
                                                rect10.heightInPixels = 204;
                                            }
                                            rect10.topInPixels = 25;
                                            rect10.isPointerBlocker = true;
                                            rect10.background = "orange";
                                            rect4.addControl(rect10);
                                            let rect11 = new GUI.Rectangle();
                                            rect11.heightInPixels = Object.keys(tasks).length * 50;
                                            rect11.thickness = 10;
                                            rect11.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                            rect11.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                            rect11.color = "Orange";
                                            rect11.background = "Orange";
                                            rect10.addControl(rect11);
                                            for (let x in tasks) {
                                                let rect12 = new GUI.Rectangle();
                                                rect12.cornerRadius = 20;
                                                rect12.height = "50px";
                                                rect12.color = "Orange";
                                                rect12.thickness = 4;
                                                rect12.topInPixels = ((-1 * ((Object.keys(tasks).length * 50) / 2)) + i * 50) + 25;
                                                rect12.background = "white";
                                                rect12.onPointerClickObservable.add(()=>{
                                                    input.text = tasks[x].name;
                                                    rect10.dispose();
                                                });
                                                rect11.addControl(rect12);
                                                let text8 = new GUI.TextBlock();
                                                text8.text = tasks[x].name;
                                                text8.color = "black";
                                                text8.fontSize = 18;
                                                rect12.addControl(text8);
                                                i = i + 1;
                                            }
                                        });
                                });
                                rect4.addControl(rect9);
                                let text3 = new GUI.TextBlock();
                                text3.text = "انتخاب از لیست کار ها";
                                text3.color = "black";
                                text3.fontSize = 18;
                                rect9.addControl(text3);
                                let rect8 = new GUI.Rectangle();
                                rect8.cornerRadius = 20;
                                rect8.height = "50px";
                                rect8.width = "150px";
                                rect8.topInPixels = 160;
                                rect8.color = "Orange";
                                rect8.thickness = 4;
                                rect8.background = "orange";
                                rect8
                                    .onPointerClickObservable
                                    .add(() => {
                                        let paramsToSend3 = new URLSearchParams();
                                        paramsToSend3.append("user", cookies.user);
                                        paramsToSend3.append("task", input.text);
                                        axios
                                            .get(serverAdrs + `/addNewSession?` + paramsToSend3.toString())
                                            .then(res => {
                                                if (res.data == "session added") {
                                                    text1.dispose();
                                                    input.dispose();
                                                    rect8.dispose();
                                                    rect9.dispose();
                                                    image
                                                        .onPointerClickObservable
                                                        .remove(rect2Obs);
                                                    image
                                                        .onPointerClickObservable
                                                        .add(() => {
                                                            let paramsToSend = new URLSearchParams();
                                                            paramsToSend.append("user", cookies.user);
                                                            axios
                                                                .get(serverAdrs + `/deleteOldSession?` + paramsToSend.toString())
                                                                .then(res => {
                                                                    if (res.data == "session deleted and saved") {
                                                                        advancedTexture2.dispose();
                                                                        controlRects[0].topInPixels = 245;
                                                                        controlRects[1].topInPixels = -360;
                                                                    }
                                                                });
                                                        })
                                                    let text5 = new GUI.TextBlock();
                                                    text5.text = "تو الان مفیدی پس مفید باش\nو گوشی دستت نگیر";
                                                    text5.color = "#fc670a";
                                                    text5.fontSize = 24;
                                                    text5.height = "200px"
                                                    rect4.addControl(text5);
                                                    let newDate1 = new Date();
                                                    let text6 = new GUI.TextBlock();
                                                    text6.text = "0:0";
                                                    text6.topInPixels = 80;
                                                    text6.color = "#fc670a";
                                                    text6.fontSize = 18;
                                                    text6.height = "200px"
                                                    rect4.addControl(text6);
                                                    const timerInterval = setInterval(() => {
                                                        let newDate2 = new Date();
                                                        let diff = newDate2.getTime() - newDate1.getTime();
                                                        let minute = 60 * 1000;
                                                        let hour = minute * 60;
                                                        let diffHour = Math.floor(diff / hour);
                                                        let diffMinute = Math.floor((diff % hour) / minute);
                                                        text6.text = diffHour + " : " + diffMinute;
                                                    }, 61000);
                                                    let text7 = new GUI.TextBlock();
                                                    text7.text = " : زمان سنج مفیدیت";
                                                    text7.topInPixels = 55;
                                                    text7.color = "#fc670a";
                                                    text7.fontSize = 18;
                                                    text7.height = "200px"
                                                    rect4.addControl(text7);
                                                }
                                            });
                                    });
                                rect4.addControl(rect8);
                                let text2 = new GUI.TextBlock();
                                text2.text = "شروع";
                                text2.color = "black";
                                text2.fontSize = 24;
                                rect8.addControl(text2);
                            });
                        advancedTexture6.addControl(controlRects[1]);
                        // **** پایان نمایش تبلت با کلید شرتکات ****
                        // **** پایان نمایش کلید های حرکتی **** **** شروع نمایش تبلت در صورت فعال بودن
                        // ****
                        let paramsToSend2 = new URLSearchParams();
                        paramsToSend2.append("user", cookies.user);
                        axios
                            .get(serverAdrs + `/getIsMofid?` + paramsToSend2.toString())
                            .then(res => {
                                let data = res.data;
                                if (data.message == "mofid") {
                                    controlRects[0].topInPixels = 1000;
                                    controlRects[1].topInPixels = 1000;
                                    const advancedTexture2 = GUI
                                        .AdvancedDynamicTexture
                                        .CreateFullscreenUI("myUI", scene);
                                    let rect4 = new GUI.Rectangle();
                                    rect4.cornerRadius = 20;
                                    rect4.height = "659px";
                                    rect4.width = "360px";
                                    rect4.color = "Orange";
                                    rect4.thickness = 4;
                                    rect4.background = "white";
                                    rect4.isPointerBlocker = true;
                                    advancedTexture2.addControl(rect4);
                                    let text5 = new GUI.TextBlock();
                                    text5.text = "تو الان مفیدی پس مفید باش\nو گوشی دستت نگیر";
                                    text5.color = "#fc670a";
                                    text5.height = "200px";
                                    text5.fontSize = 24;
                                    rect4.addControl(text5);
                                    let newDate1 = new Date(data.time);
                                    let text6 = new GUI.TextBlock();
                                    let newDate2 = new Date(data.newTime);
                                    let diff = newDate2.getTime() - newDate1.getTime();
                                    let minute = 60 * 1000;
                                    let hour = minute * 60;
                                    let diffHour = Math.floor(diff / hour);
                                    let diffMinute = Math.floor((diff % hour) / minute);
                                    text6.text = diffHour + " : " + diffMinute;
                                    text6.topInPixels = 80;
                                    text6.color = "#fc670a";
                                    text6.fontSize = 18;
                                    text6.height = "200px"
                                    rect4.addControl(text6);
                                    const timeInterval = setInterval(() => {
                                        newDate2.setMinutes(newDate2.getMinutes() + 1);
                                    }, 60000);
                                    const timerInterval = setInterval(() => {
                                        let diff = newDate2.getTime() - newDate1.getTime();
                                        let minute = 60 * 1000;
                                        let hour = minute * 60;
                                        let diffHour = Math.floor(diff / hour);
                                        let diffMinute = Math.floor((diff % hour) / minute);
                                        text6.text = diffHour + " : " + diffMinute;
                                    }, 61000);
                                    let text7 = new GUI.TextBlock();
                                    text7.text = " : زمان سنج مفیدیت";
                                    text7.topInPixels = 55;
                                    text7.color = "#fc670a";
                                    text7.fontSize = 18;
                                    text7.height = "200px"
                                    rect4.addControl(text7);
                                    let image = new GUI.Image("image1", "./close.png");
                                    image.width = "50px";
                                    image.height = "50px";
                                    image.topInPixels = -300;
                                    image.leftInPixels = 150
                                    image
                                        .onPointerClickObservable
                                        .add(() => {
                                            let paramsToSend = new URLSearchParams();
                                            paramsToSend.append("user", cookies.user);
                                            axios
                                                .get(serverAdrs + `/deleteOldSession?` + paramsToSend.toString())
                                                .then(res => {
                                                    if (res.data == "session deleted and saved") {
                                                        advancedTexture2.dispose();
                                                        controlRects[0].topInPixels = 245;
                                                        controlRects[1].topInPixels = -360;
                                                    }
                                                });
                                        });
                                    rect4.addControl(image);
                                }
                            });
                        // **** پایان نمایش تبلت در صورت فعال بودن **** **** شروع ایجاد اونت کاغذ کار
                        // جدید ****
                        const paper = scene.getMeshByName('paper1');
                        paper.actionManager = new ActionManager(scene);
                        paper
                            .actionManager
                            .registerAction(new ExecuteCodeAction({
                                trigger: ActionManager.OnPickDownTrigger
                            }, () => {
                                controlRects[0].topInPixels = 1000;
                                controlRects[1].topInPixels = 1000;
                                const advancedTexture = GUI
                                    .AdvancedDynamicTexture
                                    .CreateFullscreenUI("myUI", scene);
                                let rect1 = new GUI.Rectangle();
                                rect1.cornerRadius = 20;
                                rect1.height = "659px";
                                rect1.width = "360px";
                                rect1.color = "Orange";
                                rect1.thickness = 4;
                                rect1.background = "white";
                                rect1.isPointerBlocker = true;
                                advancedTexture.addControl(rect1);
                                let image = new GUI.Image("image1", "./close.png");
                                image.width = "50px";
                                image.height = "50px";
                                image.topInPixels = -300;
                                image.leftInPixels = 150
                                image
                                    .onPointerClickObservable
                                    .add(() => {
                                        advancedTexture.dispose();
                                        controlRects[0].topInPixels = 245;
                                        controlRects[1].topInPixels = -360;
                                    });
                                rect1.addControl(image);
                                let text1 = new GUI.TextBlock();
                                text1.text = "کار هفتگی جدیدتو اضافه کن";
                                text1.color = "orange";
                                text1.width = "270px";
                                text1.height = "80px";
                                text1.topInPixels = -300;
                                text1.fontSize = 24;
                                rect1.addControl(text1);
                                let text2 = new GUI.TextBlock();
                                text2.text = "کار جدیدی که میخوای شروع کنی\n : را بنویس";
                                text2.color = "black";
                                text2.topInPixels = -240;
                                text2.width = "300px";
                                text2.height = "80px";
                                text2.fontSize = 20;
                                rect1.addControl(text2);
                                let input = new GUI.InputText();
                                input.maxWidth = "340px";
                                input.height = "40px";
                                input.color = "black";
                                input.topInPixels = -185;
                                input.background = "orange";
                                input.placeholderText = "اسم کارتو اینجا بنویس";
                                input.placeholderColor = "black";
                                input.focusedBackground = "orange";
                                input.autoStretchWidth = true;
                                rect1.addControl(input);
                                let text3 = new GUI.TextBlock();
                                text3.width = "340px";
                                text3.height = "70px";
                                text3.topInPixels = -120;
                                text3.color = "black";
                                text3.fontSize = 20;
                                text3.text = "روزایی تو هفته که میخوای\nانجامش بدی رو هم انتخاب کن";
                                rect1.addControl(text3);
                                let rectArray1 = [];
                                let textArray1 = [];
                                let isPicked = [];
                                for (let i = 0; i < 7; i++) {
                                    rectArray1[i] = new GUI.Rectangle();
                                    rectArray1[i].cornerRadius = 20;
                                    rectArray1[i].height = "40px";
                                    rectArray1[i].topInPixels = 0;
                                    rectArray1[i].leftInPixels = 0;
                                    rectArray1[i].width = "70px";
                                    rectArray1[i].color = "Orange";
                                    rectArray1[i].thickness = 4;
                                    rectArray1[i].background = "white";
                                    textArray1[i] = new GUI.TextBlock();
                                    textArray1[i].color = "black";
                                    textArray1[i].fontSize = 20;
                                    switch (i) {
                                        case 6:
                                            textArray1[i].text = "شنبه";
                                            rectArray1[i].topInPixels = -55;
                                            rectArray1[i].leftInPixels = 115;
                                            break;
                                        case 0:
                                            textArray1[i].text = "یک شنبه";
                                            rectArray1[i].topInPixels = -55;
                                            rectArray1[i].leftInPixels = 42;
                                            break;
                                        case 1:
                                            textArray1[i].text = "دوشنبه";
                                            rectArray1[i].topInPixels = -55;
                                            rectArray1[i].leftInPixels = -31;
                                            break;
                                        case 2:
                                            textArray1[i].text = "سه شنبه";
                                            rectArray1[i].topInPixels = -55;
                                            rectArray1[i].leftInPixels = -104;
                                            break;
                                        case 3:
                                            textArray1[i].text = "چهارشنبه";
                                            rectArray1[i].topInPixels = -5;
                                            rectArray1[i].leftInPixels = 115;
                                            break;
                                        case 4:
                                            textArray1[i].text = "پنجشنبه";
                                            rectArray1[i].topInPixels = -5;
                                            rectArray1[i].leftInPixels = 42;
                                            break;
                                        case 5:
                                            textArray1[i].text = "جمعه";
                                            rectArray1[i].topInPixels = -5;
                                            rectArray1[i].leftInPixels = -31;
                                            break;
                                    }
                                    isPicked[i] = false;
                                    rectArray1[i]
                                        .onPointerClickObservable
                                        .add(() => {
                                            if (!isPicked[i]) {
                                                rectArray1[i].background = "black";
                                                textArray1[i].color = "white";
                                                isPicked[i] = 1;
                                            } else {
                                                rectArray1[i].background = "white";
                                                textArray1[i].color = "black";
                                                isPicked[i] = 0;
                                            }
                                        });
                                    rect1.addControl(rectArray1[i]);
                                    rectArray1[i].addControl(textArray1[i]);
                                }
                                let text4 = new GUI.TextBlock();
                                text4.width = "340px";
                                text4.height = "40px";
                                text4.topInPixels = 45;
                                text4.color = "black";
                                text4.fontSize = 20;
                                text4.text = "کارت توضیحات داره ؟ خب بنویس";
                                rect1.addControl(text4);
                                let inputTextArea = new GUI.InputTextArea('Example InputTextArea', "");
                                inputTextArea.color = "white";
                                inputTextArea.fontSize = 18;
                                inputTextArea.width = "350px";
                                inputTextArea.height = "200px";
                                inputTextArea.topInPixels = 165;
                                rect1.addControl(inputTextArea);
                                let rect3 = new GUI.Rectangle();
                                rect3.cornerRadius = 20;
                                rect3.height = "50px";
                                rect3.topInPixels = 295;
                                rect3.width = "200px";
                                rect3.color = "Orange";
                                rect3.thickness = 4;
                                rect3.background = "Orange";
                                rect3
                                    .onPointerClickObservable
                                    .add(() => {
                                        let paramsToSend = new URLSearchParams();
                                        paramsToSend.append("user", cookies.user);
                                        paramsToSend.append("name", input.text);
                                        paramsToSend.append("weekDays", isPicked);
                                        paramsToSend.append("description", inputTextArea.text);
                                        axios
                                            .get(serverAdrs + `/addNewTask?` + paramsToSend.toString())
                                            .then(res => {
                                                if (res.data == "task added") {
                                                    advancedTexture.dispose();
                                                    controlRects[0].topInPixels = 245;
                                                    controlRects[1].topInPixels = -360;
                                                }
                                            });
                                    });
                                rect1.addControl(rect3);
                                let text5 = new GUI.TextBlock();
                                text5.width = "340px";
                                text5.height = "40px";
                                text5.color = "black";
                                text5.fontSize = 25;
                                text5.text = "ذخیره";
                                rect3.addControl(text5);
                            },),);
                        // **** پایان ایجاد اونت کاغذ کار جدید **** **** شروع ایجاد اونت تبلت ****
                        const tablet = scene.getMeshByName('tablet');
                        tablet.actionManager = new ActionManager(scene);
                        tablet
                            .actionManager
                            .registerAction(new ExecuteCodeAction({
                                trigger: ActionManager.OnPickDownTrigger
                            }, () => {
                                controlRects[0].topInPixels = 1000;
                                controlRects[1].topInPixels = 1000;
                                const advancedTexture2 = GUI
                                    .AdvancedDynamicTexture
                                    .CreateFullscreenUI("myUI", scene);
                                let rect4 = new GUI.Rectangle();
                                rect4.cornerRadius = 20;
                                rect4.height = "659px";
                                rect4.width = "360px";
                                rect4.color = "Orange";
                                rect4.thickness = 4;
                                rect4.background = "white";
                                rect4.isPointerBlocker = true;
                                advancedTexture2.addControl(rect4);
                                let image = new GUI.Image("image1", "./close.png");
                                image.width = "50px";
                                image.height = "50px";
                                image.topInPixels = -300;
                                image.leftInPixels = 150
                                let rect2Obs = image
                                    .onPointerClickObservable
                                    .add(() => {
                                        advancedTexture2.dispose();
                                        controlRects[0].topInPixels = 245;
                                        controlRects[1].topInPixels = -360;
                                    });
                                rect4.addControl(image);
                                let text1 = new GUI.TextBlock();
                                text1.text = "اسم کاری که میخوای بهش مشغول شی رو انتخاب کن\nو شروع کن";
                                text1.color = "black";
                                text1.topInPixels = -70;
                                text1.fontSize = 18;
                                text1.height = "180px"
                                rect4.addControl(text1);
                                let input = new GUI.InputText();
                                input.maxWidth = "340px";
                                input.height = "40px";
                                input.color = "black";
                                input.background = "orange";
                                input.placeholderText = "اسم کارتو اینجا بنویس";
                                input.placeholderColor = "black";
                                input.focusedBackground = "orange";
                                input.autoStretchWidth = true;
                                rect4.addControl(input);
                                let rect9 = new GUI.Rectangle();
                                rect9.cornerRadius = 5;
                                rect9.height = "40px";
                                rect9.width = "250px";
                                rect9.topInPixels = 70;
                                rect9.color = "Orange";
                                rect9.thickness = 4;
                                rect9.background = "orange";
                                rect9.onPointerClickObservable.add(()=>{
                                    let paramsToSend = new URLSearchParams();
                                    paramsToSend.append("user", cookies.user);
                                    axios
                                        .get(serverAdrs + `/getJobs?` + paramsToSend.toString())
                                        .then(res => {
                                            let tasks = res.data;
                                            let i = 0;
                                            let rect10 = new GUI.ScrollViewer();
                                            rect10.width = "280px";
                                            if (Object.keys(tasks).length < 6) {
                                                rect10.heightInPixels =Object.keys(tasks).length * 52
                                            }
                                            else {
                                                rect10.heightInPixels = 254;
                                            }
                                            rect10.topInPixels = 25;
                                            rect10.isPointerBlocker = true;
                                            rect10.background = "orange";
                                            rect4.addControl(rect10);
                                            let rect11 = new GUI.Rectangle();
                                            rect11.heightInPixels = Object.keys(tasks).length * 50;
                                            rect11.thickness = 10;
                                            rect11.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                            rect11.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                            rect11.color = "Orange";
                                            rect11.background = "Orange";
                                            rect10.addControl(rect11);
                                            for (let x in tasks) {
                                                let rect12 = new GUI.Rectangle();
                                                rect12.cornerRadius = 20;
                                                rect12.height = "50px";
                                                rect12.color = "Orange";
                                                rect12.thickness = 4;
                                                rect12.topInPixels = ((-1 * ((Object.keys(tasks).length * 50) / 2)) + i * 50) + 25;
                                                rect12.background = "white";
                                                rect12.onPointerClickObservable.add(()=>{
                                                    input.text = tasks[x].name;
                                                    rect10.dispose();
                                                });
                                                rect11.addControl(rect12);
                                                let text8 = new GUI.TextBlock();
                                                text8.text = tasks[x].name;
                                                text8.color = "black";
                                                text8.fontSize = 18;
                                                rect12.addControl(text8);
                                                i = i + 1;
                                            }
                                        });
                                });
                                rect4.addControl(rect9);
                                let text3 = new GUI.TextBlock();
                                text3.text = "انتخاب از لیست کار ها";
                                text3.color = "black";
                                text3.fontSize = 18;
                                rect9.addControl(text3);
                                let rect8 = new GUI.Rectangle();
                                rect8.cornerRadius = 20;
                                rect8.height = "50px";
                                rect8.width = "150px";
                                rect8.topInPixels = 160;
                                rect8.color = "Orange";
                                rect8.thickness = 4;
                                rect8.background = "orange";
                                rect8
                                    .onPointerClickObservable
                                    .add(() => {
                                        let paramsToSend3 = new URLSearchParams();
                                        paramsToSend3.append("user", cookies.user);
                                        paramsToSend3.append("task", input.text);
                                        axios
                                            .get(serverAdrs + `/addNewSession?` + paramsToSend3.toString())
                                            .then(res => {
                                                if (res.data == "session added") {
                                                    text1.dispose();
                                                    input.dispose();
                                                    rect8.dispose();
                                                    rect9.dispose();
                                                    image
                                                        .onPointerClickObservable
                                                        .remove(rect2Obs);
                                                    image
                                                        .onPointerClickObservable
                                                        .add(() => {
                                                            let paramsToSend = new URLSearchParams();
                                                            paramsToSend.append("user", cookies.user);
                                                            axios
                                                                .get(serverAdrs + `/deleteOldSession?` + paramsToSend.toString())
                                                                .then(res => {
                                                                    if (res.data == "session deleted and saved") {
                                                                        advancedTexture2.dispose();
                                                                        controlRects[0].topInPixels = 245;
                                                                        controlRects[1].topInPixels = -360;
                                                                    }
                                                                });
                                                        })
                                                    let text5 = new GUI.TextBlock();
                                                    text5.text = "تو الان مفیدی پس مفید باش\nو گوشی دستت نگیر";
                                                    text5.color = "#fc670a";
                                                    text5.fontSize = 24;
                                                    text5.height = "200px"
                                                    rect4.addControl(text5);
                                                    let newDate1 = new Date();
                                                    let text6 = new GUI.TextBlock();
                                                    text6.text = "0:0";
                                                    text6.topInPixels = 80;
                                                    text6.color = "#fc670a";
                                                    text6.fontSize = 18;
                                                    text6.height = "200px"
                                                    rect4.addControl(text6);
                                                    const timerInterval = setInterval(() => {
                                                        let newDate2 = new Date();
                                                        let diff = newDate2.getTime() - newDate1.getTime();
                                                        let minute = 60 * 1000;
                                                        let hour = minute * 60;
                                                        let diffHour = Math.floor(diff / hour);
                                                        let diffMinute = Math.floor((diff % hour) / minute);
                                                        text6.text = diffHour + " : " + diffMinute;
                                                    }, 61000);
                                                    let text7 = new GUI.TextBlock();
                                                    text7.text = " : زمان سنج مفیدیت";
                                                    text7.topInPixels = 55;
                                                    text7.color = "#fc670a";
                                                    text7.fontSize = 18;
                                                    text7.height = "200px"
                                                    rect4.addControl(text7);
                                                }
                                            });
                                    });
                                rect4.addControl(rect8);
                                let text2 = new GUI.TextBlock();
                                text2.text = "شروع";
                                text2.color = "black";
                                text2.fontSize = 24;
                                rect8.addControl(text2);
                            },),);
                        // **** پایان ایجاد اونت تبلت **** **** شروع ایجاد اونت کاغذ نمایش کار ها ****
                        const paper2 = scene.getMeshByName('paper1.001');
                        paper2.actionManager = new ActionManager(scene);
                        paper2
                            .actionManager
                            .registerAction(new ExecuteCodeAction({
                                trigger: ActionManager.OnPickDownTrigger
                            }, () => {
                                controlRects[0].topInPixels = 1000;
                                controlRects[1].topInPixels = 1000;
                                const advancedTexture = GUI
                                    .AdvancedDynamicTexture
                                    .CreateFullscreenUI("myUI", scene);
                                let rect1 = new GUI.Rectangle();
                                rect1.cornerRadius = 20;
                                rect1.height = "659px";
                                rect1.width = "360px";
                                rect1.color = "Orange";
                                rect1.thickness = 4;
                                rect1.background = "white";
                                rect1.isPointerBlocker = true;
                                advancedTexture.addControl(rect1);
                                let image = new GUI.Image("image1", "./close.png");
                                image.width = "50px";
                                image.height = "50px";
                                image.topInPixels = -300;
                                image.leftInPixels = 150
                                image
                                    .onPointerClickObservable
                                    .add(() => {
                                        advancedTexture.dispose();
                                        controlRects[0].topInPixels = 245;
                                        controlRects[1].topInPixels = -360;
                                    });
                                rect1.addControl(image);
                                let text1 = new GUI.TextBlock();
                                text1.text = " : لیست کار ها";
                                text1.color = "red";
                                text1.topInPixels = -300;
                                text1.fontSize = 24;
                                text1.width = "150px";
                                text1.height = "100px";
                                rect1.addControl(text1);
                                let paramsToSend = new URLSearchParams();
                                paramsToSend.append("user", cookies.user);
                                axios
                                    .get(serverAdrs + `/getJobs?` + paramsToSend.toString())
                                    .then(res => {
                                        let tasks = res.data;
                                        let i = 0;
                                        for (let x in tasks) {
                                            let rect3 = new GUI.Rectangle();
                                            rect3.cornerRadius = 20;
                                            rect3.height = "45px";
                                            rect3.color = "Orange";
                                            rect3.thickness = 4;
                                            rect3.background = "white";
                                            rect3.topInPixels = -250 + (i * 47);
                                            rect1.addControl(rect3);
                                            let text2 = new GUI.TextBlock();
                                            text2.text = tasks[x].name;
                                            text2.color = "black";
                                            text2.fontSize = 19;
                                            text2.leftInPixels = 75;
                                            text2.width = "220px";
                                            text2.height = "40px";
                                            rect3.addControl(text2);
                                            let rect4 = new GUI.Rectangle();
                                            rect4.cornerRadius = 20;
                                            rect4.height = "45px";
                                            rect4.width = "70px";
                                            rect4.color = "Orange";
                                            rect4.thickness = 4;
                                            rect4.background = "orange";
                                            rect4.leftInPixels = -120;
                                            rect4
                                                .onPointerClickObservable
                                                .add(() => {
                                                    let paramsToSend = new URLSearchParams();
                                                    paramsToSend.append("user", cookies.user);
                                                    paramsToSend.append("task", x);
                                                    axios
                                                        .get(serverAdrs + `/deleteOldTask?` + paramsToSend.toString())
                                                        .then(res => {
                                                            if (res.data == "task deleted") {
                                                                rect3.dispose();
                                                            }
                                                        });
                                                });
                                            rect3.addControl(rect4);
                                            let text3 = new GUI.TextBlock();
                                            text3.text = "حذف";
                                            text3.color = "black";
                                            text3.fontSize = 19;
                                            rect4.addControl(text3);
                                            i = i + 1;
                                        }
                                    });
                            },),);
                        // **** پایان ایجاد اونت کاغذ نمایش کار ها **** **** شروع ایجاد اونت کاغذ نمایش
                        // تاریخچه ****
                        const paper3 = scene.getMeshByName('paper1.002');
                        paper3.actionManager = new ActionManager(scene);
                        paper3
                            .actionManager
                            .registerAction(new ExecuteCodeAction({
                                trigger: ActionManager.OnPickDownTrigger
                            }, () => {
                                controlRects[0].topInPixels = 1000;
                                controlRects[1].topInPixels = 1000;
                                const advancedTexture = GUI
                                    .AdvancedDynamicTexture
                                    .CreateFullscreenUI("myUI", scene);
                                let rect1 = new GUI.Rectangle();
                                rect1.cornerRadius = 20;
                                rect1.height = "659px";
                                rect1.width = "360px";
                                rect1.color = "Orange";
                                rect1.thickness = 4;
                                rect1.background = "white";
                                rect1.isPointerBlocker = true;
                                advancedTexture.addControl(rect1);
                                let image = new GUI.Image("image1", "./close.png");
                                image.width = "50px";
                                image.height = "50px";
                                image.topInPixels = -300;
                                image.leftInPixels = 150
                                image
                                    .onPointerClickObservable
                                    .add(() => {
                                        advancedTexture.dispose();
                                        controlRects[0].topInPixels = 245;
                                        controlRects[1].topInPixels = -360;
                                    });
                                rect1.addControl(image);
                                let dailyMeshes = [];
                                let paramsToSend = new URLSearchParams();
                                paramsToSend.append("user", cookies.user);
                                axios
                                    .get(serverAdrs + `/getMofidHistory?` + paramsToSend.toString())
                                    .then(res => {
                                        let data = res.data;
                                        let daily = data.daily;
                                        let weekly = data.weekly;
                                        let toDay = new Date();
                                        let i = 0;
                                        dailyMeshes[0] = new GUI.TextBlock();
                                        dailyMeshes[0].text = "تاریخچه ساعتی";
                                        dailyMeshes[0].color = "#fc670a";
                                        dailyMeshes[0].topInPixels = -300;
                                        dailyMeshes[0].fontSize = 24;
                                        dailyMeshes[0].width = "150px";
                                        dailyMeshes[0].height = "100px";
                                        dailyMeshes[0]
                                            .onPointerClickObservable
                                            .add(() => {
                                                if (dailyMeshes[0].text == "تاریخچه ساعتی") {
                                                    // **** شروع ایجاد صفحه تاریخچه هتفگی ****
                                                    dailyMeshes[0].text = "تاریخچه روزانه";
                                                    let toDay = new Date();
                                                    let i = 0;
                                                    for (let l = 1; l < dailyMeshes.length; l++) {
                                                        dailyMeshes[l].dispose();
                                                    }
                                                    dailyMeshes[1] = new GUI.TextBlock();
                                                    let perDate = jalaali.toJalaali(toDay.getFullYear(), (toDay.getMonth() + 1), 1);
                                                    dailyMeshes[1].text = perDate.jy;
                                                    dailyMeshes[1].color = "black";
                                                    dailyMeshes[1].topInPixels = -265;
                                                    dailyMeshes[1].fontSize = 19;
                                                    dailyMeshes[1].width = "120px";
                                                    dailyMeshes[1].height = "50px";
                                                    rect1.addControl(dailyMeshes[1]);
                                                    dailyMeshes[3] = new GUI.ScrollViewer();
                                                    dailyMeshes[3].width = "390px";
                                                    dailyMeshes[3].height = "550px";
                                                    dailyMeshes[3].topInPixels = 25;
                                                    dailyMeshes[3].background = "orange";
                                                    rect1.addControl(dailyMeshes[3]);
                                                    dailyMeshes[4] = new GUI.Rectangle();
                                                    dailyMeshes[4].thickness = 10;
                                                    dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                                    dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                                    dailyMeshes[4].color = "Orange";
                                                    dailyMeshes[4].background = "Orange";
                                                    dailyMeshes[3].addControl(dailyMeshes[4]);
                                                    let f = 0;
                                                    for (let k = 0; k < weekly.length; k++) {
                                                        if (weekly[k]['minutesDuration'] || weekly[k]['hourDuration']) {
                                                            let rect3 = new GUI.Rectangle();
                                                            rect3.cornerRadius = 20;
                                                            rect3.height = "45px";
                                                            rect3.color = "Orange";
                                                            rect3.thickness = 4;
                                                            rect3.topInPixels = -247 + f * 45;
                                                            f = f + 1;
                                                            rect3.background = "white";
                                                            dailyMeshes[4].addControl(rect3);
                                                            let text2 = new GUI.TextBlock();
                                                            text2.text = "روز";
                                                            text2.color = "black";
                                                            text2.fontSize = 19;
                                                            text2.leftInPixels = 155;
                                                            text2.width = "30px";
                                                            text2.height = "40px";
                                                            rect3.addControl(text2);
                                                            let text3 = new GUI.TextBlock();
                                                            let datearray = weekly[k]['date'].split("-");
                                                            let perDate = jalaali.toJalaali(
                                                                Number(datearray[0]),
                                                                Number(datearray[1]) + 1,
                                                                Number(datearray[2])
                                                            );
                                                            text3.text = perDate.jy + "-" + perDate.jm + "-" + perDate.jd;
                                                            text3.color = "#fc670a";
                                                            text3.fontSize = 19;
                                                            text3.leftInPixels = 90;
                                                            text3.width = "110px";
                                                            text3.height = "40px";
                                                            rect3.addControl(text3);
                                                            let text4 = new GUI.TextBlock();
                                                            text4.text = "به مدت";
                                                            text4.color = "black";
                                                            text4.fontSize = 19;
                                                            text4.leftInPixels = 15;
                                                            text4.width = "80px";
                                                            text4.height = "40px";
                                                            rect3.addControl(text4);
                                                            while (weekly[k]['minutesDuration'] / 60 >= 1) {
                                                                weekly[k]['hourDuration'] = Math.floor(weekly[k]['hourDuration']) + 1;
                                                                weekly[k]['minutesDuration'] = weekly[k]['minutesDuration'] - 60;
                                                            }
                                                            let text5 = new GUI.TextBlock();
                                                            text5.text = Math.floor(weekly[k]['hourDuration']) + " : " + Math.floor(
                                                                weekly[k]['minutesDuration']
                                                            );
                                                            text5.color = "#fc670a";
                                                            text5.fontSize = 19;
                                                            text5.leftInPixels = -40;
                                                            text5.width = "80px";
                                                            text5.height = "40px";
                                                            rect3.addControl(text5);
                                                            let text6 = new GUI.TextBlock();
                                                            text6.text = "مفید بودی";
                                                            text6.color = "black";
                                                            text6.fontSize = 19;
                                                            text6.leftInPixels = -105;
                                                            text6.width = "80px";
                                                            text6.height = "40px";
                                                            rect3.addControl(text6);
                                                        }
                                                    }
                                                    // **** پایان ایجاد صفحه تاریخچه هتفگی ****
                                                } else {
                                                    // **** شروع نمایش تاریخچه روزانه در کلید****
                                                    for (let l = 1; l < dailyMeshes.length; l++) {
                                                        dailyMeshes[l].dispose();
                                                    }
                                                    dailyMeshes[0].text = "تاریخچه ساعتی";
                                                    dailyMeshes[1] = new GUI.TextBlock();
                                                    let perDate = jalaali.toJalaali(
                                                        toDay.getFullYear(),
                                                        (toDay.getMonth() + 1),
                                                        toDay.getDate()
                                                    );
                                                    dailyMeshes[1].text = perDate.jy + "/" + perDate.jm + "/" + perDate.jd;
                                                    dailyMeshes[1].color = "black";
                                                    dailyMeshes[1].topInPixels = -265;
                                                    dailyMeshes[1].fontSize = 19;
                                                    dailyMeshes[1].width = "150px";
                                                    dailyMeshes[1].height = "50px";
                                                    rect1.addControl(dailyMeshes[1]);
                                                    // **** شروع ایجاد کلید رفتن به روز بعد ****
                                                    dailyMeshes[2] = new GUI.TextBlock();
                                                    dailyMeshes[2].text = ">";
                                                    dailyMeshes[2].color = "#244575";
                                                    dailyMeshes[2].topInPixels = -265;
                                                    dailyMeshes[2].leftInPixels = 60;
                                                    dailyMeshes[2].fontSize = 28;
                                                    dailyMeshes[2].width = "20px";
                                                    dailyMeshes[2].height = "100px";
                                                    dailyMeshes[2]
                                                        .onPointerClickObservable
                                                        .add(() => {
                                                            toDay.setDate(toDay.getDate() + 1);
                                                            let perDate = jalaali.toJalaali(
                                                                toDay.getFullYear(),
                                                                (toDay.getMonth() + 1),
                                                                toDay.getDate()
                                                            );
                                                            dailyMeshes[1].text = perDate.jy + "/" + perDate.jm + "/" + perDate.jd;
                                                            for (i = 0; i < daily.length; i++) {
                                                                if (daily[i][0].date == String(toDay.getFullYear()) + "-" + String(
                                                                    toDay.getMonth()
                                                                ) + "-" + String(toDay.getDate())) {
                                                                    break;
                                                                }
                                                            }
                                                            dailyMeshes[3].dispose();
                                                            if (i != daily.length) {
                                                                dailyMeshes[3] = new GUI.ScrollViewer();
                                                                dailyMeshes[3].width = "360px";
                                                                dailyMeshes[3].height = "550px";
                                                                dailyMeshes[3].topInPixels = 25;
                                                                dailyMeshes[3].background = "orange";
                                                                dailyMeshes[3].barColor = "black";
                                                                rect1.addControl(dailyMeshes[3]);
                                                                dailyMeshes[4] = new GUI.Rectangle();
                                                                dailyMeshes[4].heightInPixels = daily[i].length * 90;
                                                                dailyMeshes[4].thickness = 10;
                                                                dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                                                dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                                                dailyMeshes[4].color = "Orange";
                                                                dailyMeshes[4].background = "Orange";
                                                                dailyMeshes[3].addControl(dailyMeshes[4]);
                                                                for (let j = 0; j < daily[i].length; j++) {
                                                                    let rect3 = new GUI.Rectangle();
                                                                    rect3.cornerRadius = 15;
                                                                    rect3.height = "90px";
                                                                    rect3.color = "Orange";
                                                                    rect3.thickness = 4;
                                                                    rect3.topInPixels = ((-1 * ((daily[i].length * 90) / 2)) + j * 90) + 45;
                                                                    rect3.background = "white";
                                                                    dailyMeshes[4].addControl(rect3);
                                                                    let text2 = new GUI.TextBlock();
                                                                    text2.text = "از";
                                                                    text2.color = "black";
                                                                    text2.fontSize = 19;
                                                                    text2.topInPixels = -20;
                                                                    text2.leftInPixels = 120;
                                                                    text2.width = "30px";
                                                                    text2.height = "40px";
                                                                    rect3.addControl(text2);
                                                                    let text3 = new GUI.TextBlock();
                                                                    text3.text = daily[i][j].startHour + " : " + daily[i][j].startMinute;
                                                                    text3.color = "#fc670a";
                                                                    text3.topInPixels = -20;
                                                                    text3.fontSize = 19;
                                                                    text3.leftInPixels = 80;
                                                                    text3.width = "60px";
                                                                    text3.height = "40px";
                                                                    rect3.addControl(text3);
                                                                    let text6 = new GUI.TextBlock();
                                                                    text6.text = "تا";
                                                                    text6.color = "black";
                                                                    text6.fontSize = 19;
                                                                    text6.topInPixels = -20;
                                                                    text6.leftInPixels = 40;
                                                                    text6.width = "50px";
                                                                    text6.height = "40px";
                                                                    rect3.addControl(text6);
                                                                    let endHour = daily[i][j].hourDuration + daily[i][j].startHour
                                                                    let endMinute = daily[i][j].minutesDuration + daily[i][j].startMinute
                                                                    while (endMinute / 60 >= 1) {
                                                                        endHour = endHour + 1;
                                                                        endMinute = endMinute - 60;
                                                                    }
                                                                    let text7 = new GUI.TextBlock();
                                                                    text7.text = Math.floor(endHour) + " : " + Math.floor(endMinute);
                                                                    text7.color = "#fc670a";
                                                                    text7.fontSize = 19;
                                                                    text7.topInPixels = -20;
                                                                    text7.leftInPixels = 0;
                                                                    text7.width = "60px";
                                                                    text7.height = "40px";
                                                                    rect3.addControl(text7);
                                                                    let text14 = new GUI.TextBlock();
                                                                    text14.text = "به مدت";
                                                                    text14.color = "black";
                                                                    text14.fontSize = 19;
                                                                    text14.leftInPixels = -55;
                                                                    text14.width = "50px";
                                                                    text14.topInPixels = -20;
                                                                    text14.height = "40px";
                                                                    rect3.addControl(text14);
                                                                    let text15 = new GUI.TextBlock();
                                                                    text15.text = Math.floor(daily[i][j].hourDuration) + " : " + Math.floor(
                                                                        daily[i][j].minutesDuration
                                                                    );
                                                                    text15.color = "#fc670a";
                                                                    text15.fontSize = 19;
                                                                    text15.leftInPixels = -110;
                                                                    text15.width = "60px";
                                                                    text15.topInPixels = -20;
                                                                    text15.height = "40px";
                                                                    rect3.addControl(text15);
                                                                    let text11 = new GUI.TextBlock();
                                                                    text11.text = "مشغول انجام کار";
                                                                    text11.color = "black";
                                                                    text11.fontSize = 19;
                                                                    text11.topInPixels = 18;
                                                                    text11.leftInPixels = 95;
                                                                    text11.width = "120px";
                                                                    text11.height = "40px";
                                                                    rect3.addControl(text11);
                                                                    let text12 = new GUI.TextBlock();
                                                                    text12.text = daily[i][j].task;
                                                                    text12.color = "#fc670a";
                                                                    text12.fontSize = 19;
                                                                    text12.topInPixels = 18;
                                                                    text12.leftInPixels = -40;
                                                                    text12.width = "150px";
                                                                    text12.height = "40px";
                                                                    rect3.addControl(text12);
                                                                    let text13 = new GUI.TextBlock();
                                                                    text13.text = "بودی";
                                                                    text13.color = "black";
                                                                    text13.fontSize = 19;
                                                                    text13.topInPixels = 18;
                                                                    text13.leftInPixels = -135;
                                                                    text13.width = "105px";
                                                                    text13.height = "40px";
                                                                    rect3.addControl(text13);
                                                                }
                                                            } else {
                                                                dailyMeshes[3] = new GUI.ScrollViewer();
                                                                dailyMeshes[3].width = "390px";
                                                                dailyMeshes[3].height = "550px";
                                                                dailyMeshes[3].topInPixels = 25;
                                                                dailyMeshes[3].background = "orange";
                                                                rect1.addControl(dailyMeshes[3]);
                                                                dailyMeshes[4] = new GUI.Rectangle();
                                                                dailyMeshes[4].adaptHeightToChildren = true;
                                                                dailyMeshes[4].thickness = 10;
                                                                dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                                                dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                                                dailyMeshes[4].color = "Orange";
                                                                dailyMeshes[4].background = "Orange";
                                                                dailyMeshes[3].addControl(dailyMeshes[4]);
                                                                let rect3 = new GUI.Rectangle();
                                                                rect3.cornerRadius = 20;
                                                                rect3.height = "90px";
                                                                rect3.color = "Orange";
                                                                rect3.thickness = 4;
                                                                rect3.topInPixels = 0;
                                                                rect3.background = "white";
                                                                dailyMeshes[4].addControl(rect3);
                                                                let text2 = new GUI.TextBlock();
                                                                text2.text = "امروز هیچکار نکردی";
                                                                text2.color = "black";
                                                                text2.fontSize = 19;
                                                                text2.height = "40px";
                                                                rect3.addControl(text2);
                                                            }

                                                        });
                                                    rect1.addControl(dailyMeshes[2]);
                                                    // **** پایان ایجاد کلید رفتن به روز بعد **** **** شروع ایجاد کلید رفتن به ماه
                                                    // بعد ****
                                                    dailyMeshes[5] = new GUI.TextBlock();
                                                    dailyMeshes[5].text = ">";
                                                    dailyMeshes[5].color = "#244575";
                                                    dailyMeshes[5].topInPixels = -265;
                                                    dailyMeshes[5].leftInPixels = 80;
                                                    dailyMeshes[5].fontSize = 28;
                                                    dailyMeshes[5].width = "20px";
                                                    dailyMeshes[5].height = "100px";
                                                    dailyMeshes[5]
                                                        .onPointerClickObservable
                                                        .add(() => {
                                                            toDay.setMonth(toDay.getMonth() + 1);
                                                            let perDate = jalaali.toJalaali(
                                                                toDay.getFullYear(),
                                                                (toDay.getMonth() + 1),
                                                                toDay.getDate()
                                                            );
                                                            dailyMeshes[1].text = perDate.jy + "/" + perDate.jm + "/" + perDate.jd;
                                                            for (i = 0; i < daily.length; i++) {
                                                                if (daily[i][0].date == String(toDay.getFullYear()) + "-" + String(
                                                                    toDay.getMonth()
                                                                ) + "-" + String(toDay.getDate())) {
                                                                    break;
                                                                }
                                                            }
                                                            dailyMeshes[3].dispose();
                                                            if (i != daily.length) {
                                                                dailyMeshes[3] = new GUI.ScrollViewer();
                                                                dailyMeshes[3].width = "360px";
                                                                dailyMeshes[3].height = "550px";
                                                                dailyMeshes[3].topInPixels = 25;
                                                                dailyMeshes[3].background = "orange";
                                                                dailyMeshes[3].barColor = "black";
                                                                rect1.addControl(dailyMeshes[3]);
                                                                dailyMeshes[4] = new GUI.Rectangle();
                                                                dailyMeshes[4].heightInPixels = daily[i].length * 90;
                                                                dailyMeshes[4].thickness = 10;
                                                                dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                                                dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                                                dailyMeshes[4].color = "Orange";
                                                                dailyMeshes[4].background = "Orange";
                                                                dailyMeshes[3].addControl(dailyMeshes[4]);
                                                                for (let j = 0; j < daily[i].length; j++) {
                                                                    let rect3 = new GUI.Rectangle();
                                                                    rect3.cornerRadius = 15;
                                                                    rect3.height = "90px";
                                                                    rect3.color = "Orange";
                                                                    rect3.thickness = 4;
                                                                    rect3.topInPixels = ((-1 * ((daily[i].length * 90) / 2)) + j * 90) + 45;
                                                                    rect3.background = "white";
                                                                    dailyMeshes[4].addControl(rect3);
                                                                    let text2 = new GUI.TextBlock();
                                                                    text2.text = "از";
                                                                    text2.color = "black";
                                                                    text2.fontSize = 19;
                                                                    text2.topInPixels = -20;
                                                                    text2.leftInPixels = 120;
                                                                    text2.width = "30px";
                                                                    text2.height = "40px";
                                                                    rect3.addControl(text2);
                                                                    let text3 = new GUI.TextBlock();
                                                                    text3.text = daily[i][j].startHour + " : " + daily[i][j].startMinute;
                                                                    text3.color = "#fc670a";
                                                                    text3.topInPixels = -20;
                                                                    text3.fontSize = 19;
                                                                    text3.leftInPixels = 80;
                                                                    text3.width = "60px";
                                                                    text3.height = "40px";
                                                                    rect3.addControl(text3);
                                                                    let text6 = new GUI.TextBlock();
                                                                    text6.text = "تا";
                                                                    text6.color = "black";
                                                                    text6.fontSize = 19;
                                                                    text6.topInPixels = -20;
                                                                    text6.leftInPixels = 40;
                                                                    text6.width = "50px";
                                                                    text6.height = "40px";
                                                                    rect3.addControl(text6);
                                                                    let endHour = daily[i][j].hourDuration + daily[i][j].startHour
                                                                    let endMinute = daily[i][j].minutesDuration + daily[i][j].startMinute
                                                                    while (endMinute / 60 >= 1) {
                                                                        endHour = endHour + 1;
                                                                        endMinute = endMinute - 60;
                                                                    }
                                                                    let text7 = new GUI.TextBlock();
                                                                    text7.text = Math.floor(endHour) + " : " + Math.floor(endMinute);
                                                                    text7.color = "#fc670a";
                                                                    text7.fontSize = 19;
                                                                    text7.topInPixels = -20;
                                                                    text7.leftInPixels = 0;
                                                                    text7.width = "60px";
                                                                    text7.height = "40px";
                                                                    rect3.addControl(text7);
                                                                    let text14 = new GUI.TextBlock();
                                                                    text14.text = "به مدت";
                                                                    text14.color = "black";
                                                                    text14.fontSize = 19;
                                                                    text14.leftInPixels = -55;
                                                                    text14.width = "50px";
                                                                    text14.topInPixels = -20;
                                                                    text14.height = "40px";
                                                                    rect3.addControl(text14);
                                                                    let text15 = new GUI.TextBlock();
                                                                    text15.text = Math.floor(daily[i][j].hourDuration) + " : " + Math.floor(
                                                                        daily[i][j].minutesDuration
                                                                    );
                                                                    text15.color = "#fc670a";
                                                                    text15.fontSize = 19;
                                                                    text15.leftInPixels = -110;
                                                                    text15.width = "60px";
                                                                    text15.topInPixels = -20;
                                                                    text15.height = "40px";
                                                                    rect3.addControl(text15);
                                                                    let text11 = new GUI.TextBlock();
                                                                    text11.text = "مشغول انجام کار";
                                                                    text11.color = "black";
                                                                    text11.fontSize = 19;
                                                                    text11.topInPixels = 18;
                                                                    text11.leftInPixels = 95;
                                                                    text11.width = "120px";
                                                                    text11.height = "40px";
                                                                    rect3.addControl(text11);
                                                                    let text12 = new GUI.TextBlock();
                                                                    text12.text = daily[i][j].task;
                                                                    text12.color = "#fc670a";
                                                                    text12.fontSize = 19;
                                                                    text12.topInPixels = 18;
                                                                    text12.leftInPixels = -40;
                                                                    text12.width = "150px";
                                                                    text12.height = "40px";
                                                                    rect3.addControl(text12);
                                                                    let text13 = new GUI.TextBlock();
                                                                    text13.text = "بودی";
                                                                    text13.color = "black";
                                                                    text13.fontSize = 19;
                                                                    text13.topInPixels = 18;
                                                                    text13.leftInPixels = -135;
                                                                    text13.width = "105px";
                                                                    text13.height = "40px";
                                                                    rect3.addControl(text13);
                                                                }
                                                            } else {
                                                                dailyMeshes[3] = new GUI.ScrollViewer();
                                                                dailyMeshes[3].width = "390px";
                                                                dailyMeshes[3].height = "550px";
                                                                dailyMeshes[3].topInPixels = 25;
                                                                dailyMeshes[3].background = "orange";
                                                                rect1.addControl(dailyMeshes[3]);
                                                                dailyMeshes[4] = new GUI.Rectangle();
                                                                dailyMeshes[4].adaptHeightToChildren = true;
                                                                dailyMeshes[4].thickness = 10;
                                                                dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                                                dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                                                dailyMeshes[4].color = "Orange";
                                                                dailyMeshes[4].background = "Orange";
                                                                dailyMeshes[3].addControl(dailyMeshes[4]);
                                                                let rect3 = new GUI.Rectangle();
                                                                rect3.cornerRadius = 20;
                                                                rect3.height = "90px";
                                                                rect3.color = "Orange";
                                                                rect3.thickness = 4;
                                                                rect3.topInPixels = 0;
                                                                rect3.background = "white";
                                                                dailyMeshes[4].addControl(rect3);
                                                                let text2 = new GUI.TextBlock();
                                                                text2.text = "امروز هیچکار نکردی";
                                                                text2.color = "black";
                                                                text2.fontSize = 19;
                                                                text2.height = "40px";
                                                                rect3.addControl(text2);
                                                            }

                                                        });
                                                    rect1.addControl(dailyMeshes[5]);
                                                    // **** پایان ایجاد کلید رفتن به ماه بعد **** **** شروع ایجاد کلید رفتن به روز
                                                    // قبل ****
                                                    dailyMeshes[6] = new GUI.TextBlock();
                                                    dailyMeshes[6].text = "<";
                                                    dailyMeshes[6].color = "#244575";
                                                    dailyMeshes[6].topInPixels = -265;
                                                    dailyMeshes[6].leftInPixels = -60;
                                                    dailyMeshes[6].fontSize = 28;
                                                    dailyMeshes[6].width = "20px";
                                                    dailyMeshes[6].height = "100px";
                                                    dailyMeshes[6]
                                                        .onPointerClickObservable
                                                        .add(() => {
                                                            toDay.setDate(toDay.getDate() - 1);
                                                            let perDate = jalaali.toJalaali(
                                                                toDay.getFullYear(),
                                                                (toDay.getMonth() + 1),
                                                                toDay.getDate()
                                                            );
                                                            dailyMeshes[1].text = perDate.jy + "/" + perDate.jm + "/" + perDate.jd;
                                                            for (i = 0; i < daily.length; i++) {
                                                                if (daily[i][0].date == String(toDay.getFullYear()) + "-" + String(
                                                                    toDay.getMonth()
                                                                ) + "-" + String(toDay.getDate())) {
                                                                    break;
                                                                }
                                                            }
                                                            dailyMeshes[3].dispose();
                                                            if (i != daily.length) {
                                                                dailyMeshes[3] = new GUI.ScrollViewer();
                                                                dailyMeshes[3].width = "360px";
                                                                dailyMeshes[3].height = "550px";
                                                                dailyMeshes[3].topInPixels = 25;
                                                                dailyMeshes[3].background = "orange";
                                                                dailyMeshes[3].barColor = "black";
                                                                rect1.addControl(dailyMeshes[3]);
                                                                dailyMeshes[4] = new GUI.Rectangle();
                                                                dailyMeshes[4].heightInPixels = daily[i].length * 90;
                                                                dailyMeshes[4].thickness = 10;
                                                                dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                                                dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                                                dailyMeshes[4].color = "Orange";
                                                                dailyMeshes[4].background = "Orange";
                                                                dailyMeshes[3].addControl(dailyMeshes[4]);
                                                                for (let j = 0; j < daily[i].length; j++) {
                                                                    let rect3 = new GUI.Rectangle();
                                                                    rect3.cornerRadius = 15;
                                                                    rect3.height = "90px";
                                                                    rect3.color = "Orange";
                                                                    rect3.thickness = 4;
                                                                    rect3.topInPixels = ((-1 * ((daily[i].length * 90) / 2)) + j * 90) + 45;
                                                                    rect3.background = "white";
                                                                    dailyMeshes[4].addControl(rect3);
                                                                    let text2 = new GUI.TextBlock();
                                                                    text2.text = "از";
                                                                    text2.color = "black";
                                                                    text2.fontSize = 19;
                                                                    text2.topInPixels = -20;
                                                                    text2.leftInPixels = 120;
                                                                    text2.width = "30px";
                                                                    text2.height = "40px";
                                                                    rect3.addControl(text2);
                                                                    let text3 = new GUI.TextBlock();
                                                                    text3.text = daily[i][j].startHour + " : " + daily[i][j].startMinute;
                                                                    text3.color = "#fc670a";
                                                                    text3.topInPixels = -20;
                                                                    text3.fontSize = 19;
                                                                    text3.leftInPixels = 80;
                                                                    text3.width = "60px";
                                                                    text3.height = "40px";
                                                                    rect3.addControl(text3);
                                                                    let text6 = new GUI.TextBlock();
                                                                    text6.text = "تا";
                                                                    text6.color = "black";
                                                                    text6.fontSize = 19;
                                                                    text6.topInPixels = -20;
                                                                    text6.leftInPixels = 40;
                                                                    text6.width = "50px";
                                                                    text6.height = "40px";
                                                                    rect3.addControl(text6);
                                                                    let endHour = daily[i][j].hourDuration + daily[i][j].startHour
                                                                    let endMinute = daily[i][j].minutesDuration + daily[i][j].startMinute
                                                                    while (endMinute / 60 >= 1) {
                                                                        endHour = endHour + 1;
                                                                        endMinute = endMinute - 60;
                                                                    }
                                                                    let text7 = new GUI.TextBlock();
                                                                    text7.text = Math.floor(endHour) + " : " + Math.floor(endMinute);
                                                                    text7.color = "#fc670a";
                                                                    text7.fontSize = 19;
                                                                    text7.topInPixels = -20;
                                                                    text7.leftInPixels = 0;
                                                                    text7.width = "60px";
                                                                    text7.height = "40px";
                                                                    rect3.addControl(text7);
                                                                    let text14 = new GUI.TextBlock();
                                                                    text14.text = "به مدت";
                                                                    text14.color = "black";
                                                                    text14.fontSize = 19;
                                                                    text14.leftInPixels = -55;
                                                                    text14.width = "50px";
                                                                    text14.topInPixels = -20;
                                                                    text14.height = "40px";
                                                                    rect3.addControl(text14);
                                                                    let text15 = new GUI.TextBlock();
                                                                    text15.text = Math.floor(daily[i][j].hourDuration) + " : " + Math.floor(
                                                                        daily[i][j].minutesDuration
                                                                    );
                                                                    text15.color = "#fc670a";
                                                                    text15.fontSize = 19;
                                                                    text15.leftInPixels = -110;
                                                                    text15.width = "60px";
                                                                    text15.topInPixels = -20;
                                                                    text15.height = "40px";
                                                                    rect3.addControl(text15);
                                                                    let text11 = new GUI.TextBlock();
                                                                    text11.text = "مشغول انجام کار";
                                                                    text11.color = "black";
                                                                    text11.fontSize = 19;
                                                                    text11.topInPixels = 18;
                                                                    text11.leftInPixels = 95;
                                                                    text11.width = "120px";
                                                                    text11.height = "40px";
                                                                    rect3.addControl(text11);
                                                                    let text12 = new GUI.TextBlock();
                                                                    text12.text = daily[i][j].task;
                                                                    text12.color = "#fc670a";
                                                                    text12.fontSize = 19;
                                                                    text12.topInPixels = 18;
                                                                    text12.leftInPixels = -40;
                                                                    text12.width = "150px";
                                                                    text12.height = "40px";
                                                                    rect3.addControl(text12);
                                                                    let text13 = new GUI.TextBlock();
                                                                    text13.text = "بودی";
                                                                    text13.color = "black";
                                                                    text13.fontSize = 19;
                                                                    text13.topInPixels = 18;
                                                                    text13.leftInPixels = -135;
                                                                    text13.width = "105px";
                                                                    text13.height = "40px";
                                                                    rect3.addControl(text13);
                                                                }
                                                            } else {
                                                                dailyMeshes[3] = new GUI.ScrollViewer();
                                                                dailyMeshes[3].width = "390px";
                                                                dailyMeshes[3].height = "550px";
                                                                dailyMeshes[3].topInPixels = 25;
                                                                dailyMeshes[3].background = "orange";
                                                                rect1.addControl(dailyMeshes[3]);
                                                                dailyMeshes[4] = new GUI.Rectangle();
                                                                dailyMeshes[4].adaptHeightToChildren = true;
                                                                dailyMeshes[4].thickness = 10;
                                                                dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                                                dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                                                dailyMeshes[4].color = "Orange";
                                                                dailyMeshes[4].background = "Orange";
                                                                dailyMeshes[3].addControl(dailyMeshes[4]);
                                                                let rect3 = new GUI.Rectangle();
                                                                rect3.cornerRadius = 20;
                                                                rect3.height = "90px";
                                                                rect3.color = "Orange";
                                                                rect3.thickness = 4;
                                                                rect3.topInPixels = 0;
                                                                rect3.background = "white";
                                                                dailyMeshes[4].addControl(rect3);
                                                                let text2 = new GUI.TextBlock();
                                                                text2.text = "امروز هیچکار نکردی";
                                                                text2.color = "black";
                                                                text2.fontSize = 19;
                                                                text2.height = "40px";
                                                                rect3.addControl(text2);
                                                            }
                                                        });
                                                    rect1.addControl(dailyMeshes[6]);
                                                    // **** پایان ایجاد کلید رفتن به روز قبل **** **** شروع ایجاد کلید رفتن به ماه
                                                    // قبل ****
                                                    dailyMeshes[7] = new GUI.TextBlock();
                                                    dailyMeshes[7].text = "<";
                                                    dailyMeshes[7].color = "#244575";
                                                    dailyMeshes[7].topInPixels = -265;
                                                    dailyMeshes[7].leftInPixels = -80;
                                                    dailyMeshes[7].fontSize = 28;
                                                    dailyMeshes[7].width = "20px";
                                                    dailyMeshes[7].height = "100px";
                                                    dailyMeshes[7]
                                                        .onPointerClickObservable
                                                        .add(() => {
                                                            toDay.setMonth(toDay.getMonth() - 1);
                                                            let perDate = jalaali.toJalaali(
                                                                toDay.getFullYear(),
                                                                (toDay.getMonth() + 1),
                                                                toDay.getDate()
                                                            );
                                                            dailyMeshes[1].text = perDate.jy + "/" + perDate.jm + "/" + perDate.jd;
                                                            for (i = 0; i < daily.length; i++) {
                                                                if (daily[i][0].date == String(toDay.getFullYear()) + "-" + String(
                                                                    toDay.getMonth()
                                                                ) + "-" + String(toDay.getDate())) {
                                                                    break;
                                                                }
                                                            }
                                                            dailyMeshes[3].dispose();
                                                            if (i != daily.length) {
                                                                dailyMeshes[3] = new GUI.ScrollViewer();
                                                                dailyMeshes[3].width = "360px";
                                                                dailyMeshes[3].height = "550px";
                                                                dailyMeshes[3].topInPixels = 25;
                                                                dailyMeshes[3].background = "orange";
                                                                dailyMeshes[3].barColor = "black";
                                                                rect1.addControl(dailyMeshes[3]);
                                                                dailyMeshes[4] = new GUI.Rectangle();
                                                                dailyMeshes[4].heightInPixels = daily[i].length * 90;
                                                                dailyMeshes[4].thickness = 10;
                                                                dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                                                dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                                                dailyMeshes[4].color = "Orange";
                                                                dailyMeshes[4].background = "Orange";
                                                                dailyMeshes[3].addControl(dailyMeshes[4]);
                                                                for (let j = 0; j < daily[i].length; j++) {
                                                                    let rect3 = new GUI.Rectangle();
                                                                    rect3.cornerRadius = 15;
                                                                    rect3.height = "90px";
                                                                    rect3.color = "Orange";
                                                                    rect3.thickness = 4;
                                                                    rect3.topInPixels = ((-1 * ((daily[i].length * 90) / 2)) + j * 90) + 45;
                                                                    rect3.background = "white";
                                                                    dailyMeshes[4].addControl(rect3);
                                                                    let text2 = new GUI.TextBlock();
                                                                    text2.text = "از";
                                                                    text2.color = "black";
                                                                    text2.fontSize = 19;
                                                                    text2.topInPixels = -20;
                                                                    text2.leftInPixels = 120;
                                                                    text2.width = "30px";
                                                                    text2.height = "40px";
                                                                    rect3.addControl(text2);
                                                                    let text3 = new GUI.TextBlock();
                                                                    text3.text = daily[i][j].startHour + " : " + daily[i][j].startMinute;
                                                                    text3.color = "#fc670a";
                                                                    text3.topInPixels = -20;
                                                                    text3.fontSize = 19;
                                                                    text3.leftInPixels = 80;
                                                                    text3.width = "60px";
                                                                    text3.height = "40px";
                                                                    rect3.addControl(text3);
                                                                    let text6 = new GUI.TextBlock();
                                                                    text6.text = "تا";
                                                                    text6.color = "black";
                                                                    text6.fontSize = 19;
                                                                    text6.topInPixels = -20;
                                                                    text6.leftInPixels = 40;
                                                                    text6.width = "50px";
                                                                    text6.height = "40px";
                                                                    rect3.addControl(text6);
                                                                    let endHour = daily[i][j].hourDuration + daily[i][j].startHour
                                                                    let endMinute = daily[i][j].minutesDuration + daily[i][j].startMinute
                                                                    while (endMinute / 60 >= 1) {
                                                                        endHour = endHour + 1;
                                                                        endMinute = endMinute - 60;
                                                                    }
                                                                    let text7 = new GUI.TextBlock();
                                                                    text7.text = Math.floor(endHour) + " : " + Math.floor(endMinute);
                                                                    text7.color = "#fc670a";
                                                                    text7.fontSize = 19;
                                                                    text7.topInPixels = -20;
                                                                    text7.leftInPixels = 0;
                                                                    text7.width = "60px";
                                                                    text7.height = "40px";
                                                                    rect3.addControl(text7);
                                                                    let text14 = new GUI.TextBlock();
                                                                    text14.text = "به مدت";
                                                                    text14.color = "black";
                                                                    text14.fontSize = 19;
                                                                    text14.leftInPixels = -55;
                                                                    text14.width = "50px";
                                                                    text14.topInPixels = -20;
                                                                    text14.height = "40px";
                                                                    rect3.addControl(text14);
                                                                    let text15 = new GUI.TextBlock();
                                                                    text15.text = Math.floor(daily[i][j].hourDuration) + " : " + Math.floor(
                                                                        daily[i][j].minutesDuration
                                                                    );
                                                                    text15.color = "#fc670a";
                                                                    text15.fontSize = 19;
                                                                    text15.leftInPixels = -110;
                                                                    text15.width = "60px";
                                                                    text15.topInPixels = -20;
                                                                    text15.height = "40px";
                                                                    rect3.addControl(text15);
                                                                    let text11 = new GUI.TextBlock();
                                                                    text11.text = "مشغول انجام کار";
                                                                    text11.color = "black";
                                                                    text11.fontSize = 19;
                                                                    text11.topInPixels = 18;
                                                                    text11.leftInPixels = 95;
                                                                    text11.width = "120px";
                                                                    text11.height = "40px";
                                                                    rect3.addControl(text11);
                                                                    let text12 = new GUI.TextBlock();
                                                                    text12.text = daily[i][j].task;
                                                                    text12.color = "#fc670a";
                                                                    text12.fontSize = 19;
                                                                    text12.topInPixels = 18;
                                                                    text12.leftInPixels = -40;
                                                                    text12.width = "150px";
                                                                    text12.height = "40px";
                                                                    rect3.addControl(text12);
                                                                    let text13 = new GUI.TextBlock();
                                                                    text13.text = "بودی";
                                                                    text13.color = "black";
                                                                    text13.fontSize = 19;
                                                                    text13.topInPixels = 18;
                                                                    text13.leftInPixels = -135;
                                                                    text13.width = "105px";
                                                                    text13.height = "40px";
                                                                    rect3.addControl(text13);
                                                                }
                                                            } else {
                                                                dailyMeshes[3] = new GUI.ScrollViewer();
                                                                dailyMeshes[3].width = "390px";
                                                                dailyMeshes[3].height = "550px";
                                                                dailyMeshes[3].topInPixels = 25;
                                                                dailyMeshes[3].background = "orange";
                                                                rect1.addControl(dailyMeshes[3]);
                                                                dailyMeshes[4] = new GUI.Rectangle();
                                                                dailyMeshes[4].adaptHeightToChildren = true;
                                                                dailyMeshes[4].thickness = 10;
                                                                dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                                                dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                                                dailyMeshes[4].color = "Orange";
                                                                dailyMeshes[4].background = "Orange";
                                                                dailyMeshes[3].addControl(dailyMeshes[4]);
                                                                let rect3 = new GUI.Rectangle();
                                                                rect3.cornerRadius = 20;
                                                                rect3.height = "90px";
                                                                rect3.color = "Orange";
                                                                rect3.thickness = 4;
                                                                rect3.topInPixels = 0;
                                                                rect3.background = "white";
                                                                dailyMeshes[4].addControl(rect3);
                                                                let text2 = new GUI.TextBlock();
                                                                text2.text = "امروز هیچکار نکردی";
                                                                text2.color = "black";
                                                                text2.fontSize = 19;
                                                                text2.height = "40px";
                                                                rect3.addControl(text2);
                                                            }
                                                        });
                                                    rect1.addControl(dailyMeshes[7]);
                                                    // **** پایان ایجاد کلید رفتن به روز قبل ****
                                                    dailyMeshes[3] = new GUI.ScrollViewer();
                                                    dailyMeshes[3].width = "390px";
                                                    dailyMeshes[3].height = "550px";
                                                    dailyMeshes[3].topInPixels = 25;
                                                    dailyMeshes[3].background = "orange";
                                                    rect1.addControl(dailyMeshes[3]);
                                                    dailyMeshes[4] = new GUI.Rectangle();
                                                    dailyMeshes[4].thickness = 10;
                                                    dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                                    dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                                    dailyMeshes[4].color = "Orange";
                                                    dailyMeshes[4].background = "Orange";
                                                    dailyMeshes[3].addControl(dailyMeshes[4]);
                                                    for (i = 0; i < daily.length; i++) {
                                                        if (daily[i][0].date == String(toDay.getFullYear()) + "-" + String(
                                                            toDay.getMonth()
                                                        ) + "-" + String(toDay.getDate())) {
                                                            break;
                                                        }
                                                    }
                                                    if (i != daily.length) {
                                                        dailyMeshes[3] = new GUI.ScrollViewer();
                                                        dailyMeshes[3].width = "360px";
                                                        dailyMeshes[3].height = "550px";
                                                        dailyMeshes[3].topInPixels = 25;
                                                        dailyMeshes[3].background = "orange";
                                                        dailyMeshes[3].barColor = "black";
                                                        rect1.addControl(dailyMeshes[3]);
                                                        dailyMeshes[4] = new GUI.Rectangle();
                                                        dailyMeshes[4].heightInPixels = daily[i].length * 90;
                                                        dailyMeshes[4].thickness = 10;
                                                        dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                                        dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                                        dailyMeshes[4].color = "Orange";
                                                        dailyMeshes[4].background = "Orange";
                                                        dailyMeshes[3].addControl(dailyMeshes[4]);
                                                        for (let j = 0; j < daily[i].length; j++) {
                                                            let rect3 = new GUI.Rectangle();
                                                            rect3.cornerRadius = 15;
                                                            rect3.height = "90px";
                                                            rect3.color = "Orange";
                                                            rect3.thickness = 4;
                                                            rect3.topInPixels = ((-1 * ((daily[i].length * 90) / 2)) + j * 90) + 45;
                                                            rect3.background = "white";
                                                            dailyMeshes[4].addControl(rect3);
                                                            let text2 = new GUI.TextBlock();
                                                            text2.text = "از";
                                                            text2.color = "black";
                                                            text2.fontSize = 19;
                                                            text2.topInPixels = -20;
                                                            text2.leftInPixels = 120;
                                                            text2.width = "30px";
                                                            text2.height = "40px";
                                                            rect3.addControl(text2);
                                                            let text3 = new GUI.TextBlock();
                                                            text3.text = daily[i][j].startHour + " : " + daily[i][j].startMinute;
                                                            text3.color = "#fc670a";
                                                            text3.topInPixels = -20;
                                                            text3.fontSize = 19;
                                                            text3.leftInPixels = 80;
                                                            text3.width = "60px";
                                                            text3.height = "40px";
                                                            rect3.addControl(text3);
                                                            let text6 = new GUI.TextBlock();
                                                            text6.text = "تا";
                                                            text6.color = "black";
                                                            text6.fontSize = 19;
                                                            text6.topInPixels = -20;
                                                            text6.leftInPixels = 40;
                                                            text6.width = "50px";
                                                            text6.height = "40px";
                                                            rect3.addControl(text6);
                                                            let endHour = daily[i][j].hourDuration + daily[i][j].startHour
                                                            let endMinute = daily[i][j].minutesDuration + daily[i][j].startMinute
                                                            while (endMinute / 60 >= 1) {
                                                                endHour = endHour + 1;
                                                                endMinute = endMinute - 60;
                                                            }
                                                            let text7 = new GUI.TextBlock();
                                                            text7.text = Math.floor(endHour) + " : " + Math.floor(endMinute);
                                                            text7.color = "#fc670a";
                                                            text7.fontSize = 19;
                                                            text7.topInPixels = -20;
                                                            text7.leftInPixels = 0;
                                                            text7.width = "60px";
                                                            text7.height = "40px";
                                                            rect3.addControl(text7);
                                                            let text14 = new GUI.TextBlock();
                                                            text14.text = "به مدت";
                                                            text14.color = "black";
                                                            text14.fontSize = 19;
                                                            text14.leftInPixels = -55;
                                                            text14.width = "50px";
                                                            text14.topInPixels = -20;
                                                            text14.height = "40px";
                                                            rect3.addControl(text14);
                                                            let text15 = new GUI.TextBlock();
                                                            text15.text = Math.floor(daily[i][j].hourDuration) + " : " + Math.floor(
                                                                daily[i][j].minutesDuration
                                                            );
                                                            text15.color = "#fc670a";
                                                            text15.fontSize = 19;
                                                            text15.leftInPixels = -110;
                                                            text15.width = "60px";
                                                            text15.topInPixels = -20;
                                                            text15.height = "40px";
                                                            rect3.addControl(text15);
                                                            let text11 = new GUI.TextBlock();
                                                            text11.text = "مشغول انجام کار";
                                                            text11.color = "black";
                                                            text11.fontSize = 19;
                                                            text11.topInPixels = 18;
                                                            text11.leftInPixels = 95;
                                                            text11.width = "120px";
                                                            text11.height = "40px";
                                                            rect3.addControl(text11);
                                                            let text12 = new GUI.TextBlock();
                                                            text12.text = daily[i][j].task;
                                                            text12.color = "#fc670a";
                                                            text12.fontSize = 19;
                                                            text12.topInPixels = 18;
                                                            text12.leftInPixels = -40;
                                                            text12.width = "150px";
                                                            text12.height = "40px";
                                                            rect3.addControl(text12);
                                                            let text13 = new GUI.TextBlock();
                                                            text13.text = "بودی";
                                                            text13.color = "black";
                                                            text13.fontSize = 19;
                                                            text13.topInPixels = 18;
                                                            text13.leftInPixels = -135;
                                                            text13.width = "105px";
                                                            text13.height = "40px";
                                                            rect3.addControl(text13);
                                                        }
                                                    } else {
                                                        dailyMeshes[3] = new GUI.ScrollViewer();
                                                        dailyMeshes[3].width = "390px";
                                                        dailyMeshes[3].height = "550px";
                                                        dailyMeshes[3].topInPixels = 25;
                                                        dailyMeshes[3].background = "orange";
                                                        rect1.addControl(dailyMeshes[3]);
                                                        dailyMeshes[4] = new GUI.Rectangle();
                                                        dailyMeshes[4].adaptHeightToChildren = true;
                                                        dailyMeshes[4].thickness = 10;
                                                        dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                                        dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                                        dailyMeshes[4].color = "Orange";
                                                        dailyMeshes[4].background = "Orange";
                                                        dailyMeshes[3].addControl(dailyMeshes[4]);
                                                        let rect3 = new GUI.Rectangle();
                                                        rect3.cornerRadius = 20;
                                                        rect3.height = "90px";
                                                        rect3.color = "Orange";
                                                        rect3.thickness = 4;
                                                        rect3.topInPixels = 0;
                                                        rect3.background = "white";
                                                        dailyMeshes[4].addControl(rect3);
                                                        let text2 = new GUI.TextBlock();
                                                        text2.text = "امروز هیچکار نکردی";
                                                        text2.color = "black";
                                                        text2.fontSize = 19;
                                                        text2.height = "40px";
                                                        rect3.addControl(text2);
                                                    }
                                                    // **** پایان نمایش تاریخچه روزانه در کلید****
                                                }
                                            });
                                        // **** شروع نمایش تاریخچه روزانه به صورت دیفالت ****
                                        rect1.addControl(dailyMeshes[0]);
                                        dailyMeshes[1] = new GUI.TextBlock();
                                        let perDate = jalaali.toJalaali(
                                            toDay.getFullYear(),
                                            (toDay.getMonth() + 1),
                                            toDay.getDate()
                                        );
                                        dailyMeshes[1].text = perDate.jy + "/" + perDate.jm + "/" + perDate.jd;
                                        dailyMeshes[1].color = "black";
                                        dailyMeshes[1].topInPixels = -265;
                                        dailyMeshes[1].fontSize = 19;
                                        dailyMeshes[1].width = "150px";
                                        dailyMeshes[1].height = "50px";
                                        rect1.addControl(dailyMeshes[1]);
                                        // **** شروع ایجاد کلید رفتن به روز بعد ****
                                        dailyMeshes[2] = new GUI.TextBlock();
                                        dailyMeshes[2].text = ">";
                                        dailyMeshes[2].color = "#244575";
                                        dailyMeshes[2].topInPixels = -265;
                                        dailyMeshes[2].leftInPixels = 60;
                                        dailyMeshes[2].fontSize = 28;
                                        dailyMeshes[2].width = "20px";
                                        dailyMeshes[2].height = "100px";
                                        dailyMeshes[2]
                                            .onPointerClickObservable
                                            .add(() => {
                                                toDay.setDate(toDay.getDate() + 1);
                                                let perDate = jalaali.toJalaali(
                                                    toDay.getFullYear(),
                                                    (toDay.getMonth() + 1),
                                                    toDay.getDate()
                                                );
                                                dailyMeshes[1].text = perDate.jy + "/" + perDate.jm + "/" + perDate.jd;
                                                for (i = 0; i < daily.length; i++) {
                                                    if (daily[i][0].date == String(toDay.getFullYear()) + "-" + String(
                                                        toDay.getMonth()
                                                    ) + "-" + String(toDay.getDate())) {
                                                        break;
                                                    }
                                                }
                                                dailyMeshes[3].dispose();
                                                if (i != daily.length) {
                                                    dailyMeshes[3] = new GUI.ScrollViewer();
                                                    dailyMeshes[3].width = "360px";
                                                    dailyMeshes[3].height = "550px";
                                                    dailyMeshes[3].topInPixels = 25;
                                                    dailyMeshes[3].background = "orange";
                                                    dailyMeshes[3].barColor = "black";
                                                    rect1.addControl(dailyMeshes[3]);
                                                    dailyMeshes[4] = new GUI.Rectangle();
                                                    dailyMeshes[4].heightInPixels = daily[i].length * 90;
                                                    dailyMeshes[4].thickness = 10;
                                                    dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                                    dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                                    dailyMeshes[4].color = "Orange";
                                                    dailyMeshes[4].background = "Orange";
                                                    dailyMeshes[3].addControl(dailyMeshes[4]);
                                                    for (let j = 0; j < daily[i].length; j++) {
                                                        let rect3 = new GUI.Rectangle();
                                                        rect3.cornerRadius = 15;
                                                        rect3.height = "90px";
                                                        rect3.color = "Orange";
                                                        rect3.thickness = 4;
                                                        rect3.topInPixels = ((-1 * ((daily[i].length * 90) / 2)) + j * 90) + 45;
                                                        rect3.background = "white";
                                                        dailyMeshes[4].addControl(rect3);
                                                        let text2 = new GUI.TextBlock();
                                                        text2.text = "از";
                                                        text2.color = "black";
                                                        text2.fontSize = 19;
                                                        text2.topInPixels = -20;
                                                        text2.leftInPixels = 120;
                                                        text2.width = "30px";
                                                        text2.height = "40px";
                                                        rect3.addControl(text2);
                                                        let text3 = new GUI.TextBlock();
                                                        text3.text = daily[i][j].startHour + " : " + daily[i][j].startMinute;
                                                        text3.color = "#fc670a";
                                                        text3.topInPixels = -20;
                                                        text3.fontSize = 19;
                                                        text3.leftInPixels = 80;
                                                        text3.width = "60px";
                                                        text3.height = "40px";
                                                        rect3.addControl(text3);
                                                        let text6 = new GUI.TextBlock();
                                                        text6.text = "تا";
                                                        text6.color = "black";
                                                        text6.fontSize = 19;
                                                        text6.topInPixels = -20;
                                                        text6.leftInPixels = 40;
                                                        text6.width = "50px";
                                                        text6.height = "40px";
                                                        rect3.addControl(text6);
                                                        let endHour = daily[i][j].hourDuration + daily[i][j].startHour
                                                        let endMinute = daily[i][j].minutesDuration + daily[i][j].startMinute
                                                        while (endMinute / 60 >= 1) {
                                                            endHour = endHour + 1;
                                                            endMinute = endMinute - 60;
                                                        }
                                                        let text7 = new GUI.TextBlock();
                                                        text7.text = Math.floor(endHour) + " : " + Math.floor(endMinute);
                                                        text7.color = "#fc670a";
                                                        text7.fontSize = 19;
                                                        text7.topInPixels = -20;
                                                        text7.leftInPixels = 0;
                                                        text7.width = "60px";
                                                        text7.height = "40px";
                                                        rect3.addControl(text7);
                                                        let text14 = new GUI.TextBlock();
                                                        text14.text = "به مدت";
                                                        text14.color = "black";
                                                        text14.fontSize = 19;
                                                        text14.leftInPixels = -55;
                                                        text14.width = "50px";
                                                        text14.topInPixels = -20;
                                                        text14.height = "40px";
                                                        rect3.addControl(text14);
                                                        let text15 = new GUI.TextBlock();
                                                        text15.text = Math.floor(daily[i][j].hourDuration) + " : " + Math.floor(
                                                            daily[i][j].minutesDuration
                                                        );
                                                        text15.color = "#fc670a";
                                                        text15.fontSize = 19;
                                                        text15.leftInPixels = -110;
                                                        text15.width = "60px";
                                                        text15.topInPixels = -20;
                                                        text15.height = "40px";
                                                        rect3.addControl(text15);
                                                        let text11 = new GUI.TextBlock();
                                                        text11.text = "مشغول انجام کار";
                                                        text11.color = "black";
                                                        text11.fontSize = 19;
                                                        text11.topInPixels = 18;
                                                        text11.leftInPixels = 95;
                                                        text11.width = "120px";
                                                        text11.height = "40px";
                                                        rect3.addControl(text11);
                                                        let text12 = new GUI.TextBlock();
                                                        text12.text = daily[i][j].task;
                                                        text12.color = "#fc670a";
                                                        text12.fontSize = 19;
                                                        text12.topInPixels = 18;
                                                        text12.leftInPixels = -40;
                                                        text12.width = "150px";
                                                        text12.height = "40px";
                                                        rect3.addControl(text12);
                                                        let text13 = new GUI.TextBlock();
                                                        text13.text = "بودی";
                                                        text13.color = "black";
                                                        text13.fontSize = 19;
                                                        text13.topInPixels = 18;
                                                        text13.leftInPixels = -135;
                                                        text13.width = "105px";
                                                        text13.height = "40px";
                                                        rect3.addControl(text13);
                                                    }
                                                } else {
                                                    dailyMeshes[3] = new GUI.ScrollViewer();
                                                    dailyMeshes[3].width = "390px";
                                                    dailyMeshes[3].height = "550px";
                                                    dailyMeshes[3].topInPixels = 25;
                                                    dailyMeshes[3].background = "orange";
                                                    rect1.addControl(dailyMeshes[3]);
                                                    dailyMeshes[4] = new GUI.Rectangle();
                                                    dailyMeshes[4].adaptHeightToChildren = true;
                                                    dailyMeshes[4].thickness = 10;
                                                    dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                                    dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                                    dailyMeshes[4].color = "Orange";
                                                    dailyMeshes[4].background = "Orange";
                                                    dailyMeshes[3].addControl(dailyMeshes[4]);
                                                    let rect3 = new GUI.Rectangle();
                                                    rect3.cornerRadius = 20;
                                                    rect3.height = "90px";
                                                    rect3.color = "Orange";
                                                    rect3.thickness = 4;
                                                    rect3.topInPixels = 0;
                                                    rect3.background = "white";
                                                    dailyMeshes[4].addControl(rect3);
                                                    let text2 = new GUI.TextBlock();
                                                    text2.text = "امروز هیچکار نکردی";
                                                    text2.color = "black";
                                                    text2.fontSize = 19;
                                                    text2.height = "40px";
                                                    rect3.addControl(text2);
                                                }

                                            });
                                        rect1.addControl(dailyMeshes[2]);
                                        // **** پایان ایجاد کلید رفتن به روز بعد **** **** شروع ایجاد کلید رفتن به ماه
                                        // بعد ****
                                        dailyMeshes[5] = new GUI.TextBlock();
                                        dailyMeshes[5].text = ">";
                                        dailyMeshes[5].color = "#244575";
                                        dailyMeshes[5].topInPixels = -265;
                                        dailyMeshes[5].leftInPixels = 80;
                                        dailyMeshes[5].fontSize = 28;
                                        dailyMeshes[5].width = "20px";
                                        dailyMeshes[5].height = "100px";
                                        dailyMeshes[5]
                                            .onPointerClickObservable
                                            .add(() => {
                                                toDay.setMonth(toDay.getMonth() + 1);
                                                let perDate = jalaali.toJalaali(
                                                    toDay.getFullYear(),
                                                    (toDay.getMonth() + 1),
                                                    toDay.getDate()
                                                );
                                                dailyMeshes[1].text = perDate.jy + "/" + perDate.jm + "/" + perDate.jd;
                                                for (i = 0; i < daily.length; i++) {
                                                    if (daily[i][0].date == String(toDay.getFullYear()) + "-" + String(
                                                        toDay.getMonth()
                                                    ) + "-" + String(toDay.getDate())) {
                                                        break;
                                                    }
                                                }
                                                dailyMeshes[3].dispose();
                                                if (i != daily.length) {
                                                    dailyMeshes[3] = new GUI.ScrollViewer();
                                                    dailyMeshes[3].width = "360px";
                                                    dailyMeshes[3].height = "550px";
                                                    dailyMeshes[3].topInPixels = 25;
                                                    dailyMeshes[3].background = "orange";
                                                    dailyMeshes[3].barColor = "black";
                                                    rect1.addControl(dailyMeshes[3]);
                                                    dailyMeshes[4] = new GUI.Rectangle();
                                                    dailyMeshes[4].heightInPixels = daily[i].length * 90;
                                                    dailyMeshes[4].thickness = 10;
                                                    dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                                    dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                                    dailyMeshes[4].color = "Orange";
                                                    dailyMeshes[4].background = "Orange";
                                                    dailyMeshes[3].addControl(dailyMeshes[4]);
                                                    for (let j = 0; j < daily[i].length; j++) {
                                                        let rect3 = new GUI.Rectangle();
                                                        rect3.cornerRadius = 15;
                                                        rect3.height = "90px";
                                                        rect3.color = "Orange";
                                                        rect3.thickness = 4;
                                                        rect3.topInPixels = ((-1 * ((daily[i].length * 90) / 2)) + j * 90) + 45;
                                                        rect3.background = "white";
                                                        dailyMeshes[4].addControl(rect3);
                                                        let text2 = new GUI.TextBlock();
                                                        text2.text = "از";
                                                        text2.color = "black";
                                                        text2.fontSize = 19;
                                                        text2.topInPixels = -20;
                                                        text2.leftInPixels = 120;
                                                        text2.width = "30px";
                                                        text2.height = "40px";
                                                        rect3.addControl(text2);
                                                        let text3 = new GUI.TextBlock();
                                                        text3.text = daily[i][j].startHour + " : " + daily[i][j].startMinute;
                                                        text3.color = "#fc670a";
                                                        text3.topInPixels = -20;
                                                        text3.fontSize = 19;
                                                        text3.leftInPixels = 80;
                                                        text3.width = "60px";
                                                        text3.height = "40px";
                                                        rect3.addControl(text3);
                                                        let text6 = new GUI.TextBlock();
                                                        text6.text = "تا";
                                                        text6.color = "black";
                                                        text6.fontSize = 19;
                                                        text6.topInPixels = -20;
                                                        text6.leftInPixels = 40;
                                                        text6.width = "50px";
                                                        text6.height = "40px";
                                                        rect3.addControl(text6);
                                                        let endHour = daily[i][j].hourDuration + daily[i][j].startHour
                                                        let endMinute = daily[i][j].minutesDuration + daily[i][j].startMinute
                                                        while (endMinute / 60 >= 1) {
                                                            endHour = endHour + 1;
                                                            endMinute = endMinute - 60;
                                                        }
                                                        let text7 = new GUI.TextBlock();
                                                        text7.text = Math.floor(endHour) + " : " + Math.floor(endMinute);
                                                        text7.color = "#fc670a";
                                                        text7.fontSize = 19;
                                                        text7.topInPixels = -20;
                                                        text7.leftInPixels = 0;
                                                        text7.width = "60px";
                                                        text7.height = "40px";
                                                        rect3.addControl(text7);
                                                        let text14 = new GUI.TextBlock();
                                                        text14.text = "به مدت";
                                                        text14.color = "black";
                                                        text14.fontSize = 19;
                                                        text14.leftInPixels = -55;
                                                        text14.width = "50px";
                                                        text14.topInPixels = -20;
                                                        text14.height = "40px";
                                                        rect3.addControl(text14);
                                                        let text15 = new GUI.TextBlock();
                                                        text15.text = Math.floor(daily[i][j].hourDuration) + " : " + Math.floor(
                                                            daily[i][j].minutesDuration
                                                        );
                                                        text15.color = "#fc670a";
                                                        text15.fontSize = 19;
                                                        text15.leftInPixels = -110;
                                                        text15.width = "60px";
                                                        text15.topInPixels = -20;
                                                        text15.height = "40px";
                                                        rect3.addControl(text15);
                                                        let text11 = new GUI.TextBlock();
                                                        text11.text = "مشغول انجام کار";
                                                        text11.color = "black";
                                                        text11.fontSize = 19;
                                                        text11.topInPixels = 18;
                                                        text11.leftInPixels = 95;
                                                        text11.width = "120px";
                                                        text11.height = "40px";
                                                        rect3.addControl(text11);
                                                        let text12 = new GUI.TextBlock();
                                                        text12.text = daily[i][j].task;
                                                        text12.color = "#fc670a";
                                                        text12.fontSize = 19;
                                                        text12.topInPixels = 18;
                                                        text12.leftInPixels = -40;
                                                        text12.width = "150px";
                                                        text12.height = "40px";
                                                        rect3.addControl(text12);
                                                        let text13 = new GUI.TextBlock();
                                                        text13.text = "بودی";
                                                        text13.color = "black";
                                                        text13.fontSize = 19;
                                                        text13.topInPixels = 18;
                                                        text13.leftInPixels = -135;
                                                        text13.width = "105px";
                                                        text13.height = "40px";
                                                        rect3.addControl(text13);
                                                    }
                                                } else {
                                                    dailyMeshes[3] = new GUI.ScrollViewer();
                                                    dailyMeshes[3].width = "390px";
                                                    dailyMeshes[3].height = "550px";
                                                    dailyMeshes[3].topInPixels = 25;
                                                    dailyMeshes[3].background = "orange";
                                                    rect1.addControl(dailyMeshes[3]);
                                                    dailyMeshes[4] = new GUI.Rectangle();
                                                    dailyMeshes[4].adaptHeightToChildren = true;
                                                    dailyMeshes[4].thickness = 10;
                                                    dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                                    dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                                    dailyMeshes[4].color = "Orange";
                                                    dailyMeshes[4].background = "Orange";
                                                    dailyMeshes[3].addControl(dailyMeshes[4]);
                                                    let rect3 = new GUI.Rectangle();
                                                    rect3.cornerRadius = 20;
                                                    rect3.height = "90px";
                                                    rect3.color = "Orange";
                                                    rect3.thickness = 4;
                                                    rect3.topInPixels = 0;
                                                    rect3.background = "white";
                                                    dailyMeshes[4].addControl(rect3);
                                                    let text2 = new GUI.TextBlock();
                                                    text2.text = "امروز هیچکار نکردی";
                                                    text2.color = "black";
                                                    text2.fontSize = 19;
                                                    text2.height = "40px";
                                                    rect3.addControl(text2);
                                                }

                                            });
                                        rect1.addControl(dailyMeshes[5]);
                                        // **** پایان ایجاد کلید رفتن به ماه بعد **** **** شروع ایجاد کلید رفتن به روز
                                        // قبل ****
                                        dailyMeshes[6] = new GUI.TextBlock();
                                        dailyMeshes[6].text = "<";
                                        dailyMeshes[6].color = "#244575";
                                        dailyMeshes[6].topInPixels = -265;
                                        dailyMeshes[6].leftInPixels = -60;
                                        dailyMeshes[6].fontSize = 28;
                                        dailyMeshes[6].width = "20px";
                                        dailyMeshes[6].height = "100px";
                                        dailyMeshes[6]
                                            .onPointerClickObservable
                                            .add(() => {
                                                toDay.setDate(toDay.getDate() - 1);
                                                let perDate = jalaali.toJalaali(
                                                    toDay.getFullYear(),
                                                    (toDay.getMonth() + 1),
                                                    toDay.getDate()
                                                );
                                                dailyMeshes[1].text = perDate.jy + "/" + perDate.jm + "/" + perDate.jd;
                                                for (i = 0; i < daily.length; i++) {
                                                    if (daily[i][0].date == String(toDay.getFullYear()) + "-" + String(
                                                        toDay.getMonth()
                                                    ) + "-" + String(toDay.getDate())) {
                                                        break;
                                                    }
                                                }
                                                dailyMeshes[3].dispose();
                                                if (i != daily.length) {
                                                    dailyMeshes[3] = new GUI.ScrollViewer();
                                                    dailyMeshes[3].width = "360px";
                                                    dailyMeshes[3].height = "550px";
                                                    dailyMeshes[3].topInPixels = 25;
                                                    dailyMeshes[3].background = "orange";
                                                    dailyMeshes[3].barColor = "black";
                                                    rect1.addControl(dailyMeshes[3]);
                                                    dailyMeshes[4] = new GUI.Rectangle();
                                                    dailyMeshes[4].heightInPixels = daily[i].length * 90;
                                                    dailyMeshes[4].thickness = 10;
                                                    dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                                    dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                                    dailyMeshes[4].color = "Orange";
                                                    dailyMeshes[4].background = "Orange";
                                                    dailyMeshes[3].addControl(dailyMeshes[4]);
                                                    for (let j = 0; j < daily[i].length; j++) {
                                                        let rect3 = new GUI.Rectangle();
                                                        rect3.cornerRadius = 15;
                                                        rect3.height = "90px";
                                                        rect3.color = "Orange";
                                                        rect3.thickness = 4;
                                                        rect3.topInPixels = ((-1 * ((daily[i].length * 90) / 2)) + j * 90) + 45;
                                                        rect3.background = "white";
                                                        dailyMeshes[4].addControl(rect3);
                                                        let text2 = new GUI.TextBlock();
                                                        text2.text = "از";
                                                        text2.color = "black";
                                                        text2.fontSize = 19;
                                                        text2.topInPixels = -20;
                                                        text2.leftInPixels = 120;
                                                        text2.width = "30px";
                                                        text2.height = "40px";
                                                        rect3.addControl(text2);
                                                        let text3 = new GUI.TextBlock();
                                                        text3.text = daily[i][j].startHour + " : " + daily[i][j].startMinute;
                                                        text3.color = "#fc670a";
                                                        text3.topInPixels = -20;
                                                        text3.fontSize = 19;
                                                        text3.leftInPixels = 80;
                                                        text3.width = "60px";
                                                        text3.height = "40px";
                                                        rect3.addControl(text3);
                                                        let text6 = new GUI.TextBlock();
                                                        text6.text = "تا";
                                                        text6.color = "black";
                                                        text6.fontSize = 19;
                                                        text6.topInPixels = -20;
                                                        text6.leftInPixels = 40;
                                                        text6.width = "50px";
                                                        text6.height = "40px";
                                                        rect3.addControl(text6);
                                                        let endHour = daily[i][j].hourDuration + daily[i][j].startHour
                                                        let endMinute = daily[i][j].minutesDuration + daily[i][j].startMinute
                                                        while (endMinute / 60 >= 1) {
                                                            endHour = endHour + 1;
                                                            endMinute = endMinute - 60;
                                                        }
                                                        let text7 = new GUI.TextBlock();
                                                        text7.text = Math.floor(endHour) + " : " + Math.floor(endMinute);
                                                        text7.color = "#fc670a";
                                                        text7.fontSize = 19;
                                                        text7.topInPixels = -20;
                                                        text7.leftInPixels = 0;
                                                        text7.width = "60px";
                                                        text7.height = "40px";
                                                        rect3.addControl(text7);
                                                        let text14 = new GUI.TextBlock();
                                                        text14.text = "به مدت";
                                                        text14.color = "black";
                                                        text14.fontSize = 19;
                                                        text14.leftInPixels = -55;
                                                        text14.width = "50px";
                                                        text14.topInPixels = -20;
                                                        text14.height = "40px";
                                                        rect3.addControl(text14);
                                                        let text15 = new GUI.TextBlock();
                                                        text15.text = Math.floor(daily[i][j].hourDuration) + " : " + Math.floor(
                                                            daily[i][j].minutesDuration
                                                        );
                                                        text15.color = "#fc670a";
                                                        text15.fontSize = 19;
                                                        text15.leftInPixels = -110;
                                                        text15.width = "60px";
                                                        text15.topInPixels = -20;
                                                        text15.height = "40px";
                                                        rect3.addControl(text15);
                                                        let text11 = new GUI.TextBlock();
                                                        text11.text = "مشغول انجام کار";
                                                        text11.color = "black";
                                                        text11.fontSize = 19;
                                                        text11.topInPixels = 18;
                                                        text11.leftInPixels = 95;
                                                        text11.width = "120px";
                                                        text11.height = "40px";
                                                        rect3.addControl(text11);
                                                        let text12 = new GUI.TextBlock();
                                                        text12.text = daily[i][j].task;
                                                        text12.color = "#fc670a";
                                                        text12.fontSize = 19;
                                                        text12.topInPixels = 18;
                                                        text12.leftInPixels = -40;
                                                        text12.width = "150px";
                                                        text12.height = "40px";
                                                        rect3.addControl(text12);
                                                        let text13 = new GUI.TextBlock();
                                                        text13.text = "بودی";
                                                        text13.color = "black";
                                                        text13.fontSize = 19;
                                                        text13.topInPixels = 18;
                                                        text13.leftInPixels = -135;
                                                        text13.width = "105px";
                                                        text13.height = "40px";
                                                        rect3.addControl(text13);
                                                    }
                                                } else {
                                                    dailyMeshes[3] = new GUI.ScrollViewer();
                                                    dailyMeshes[3].width = "390px";
                                                    dailyMeshes[3].height = "550px";
                                                    dailyMeshes[3].topInPixels = 25;
                                                    dailyMeshes[3].background = "orange";
                                                    rect1.addControl(dailyMeshes[3]);
                                                    dailyMeshes[4] = new GUI.Rectangle();
                                                    dailyMeshes[4].adaptHeightToChildren = true;
                                                    dailyMeshes[4].thickness = 10;
                                                    dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                                    dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                                    dailyMeshes[4].color = "Orange";
                                                    dailyMeshes[4].background = "Orange";
                                                    dailyMeshes[3].addControl(dailyMeshes[4]);
                                                    let rect3 = new GUI.Rectangle();
                                                    rect3.cornerRadius = 20;
                                                    rect3.height = "90px";
                                                    rect3.color = "Orange";
                                                    rect3.thickness = 4;
                                                    rect3.topInPixels = 0;
                                                    rect3.background = "white";
                                                    dailyMeshes[4].addControl(rect3);
                                                    let text2 = new GUI.TextBlock();
                                                    text2.text = "امروز هیچکار نکردی";
                                                    text2.color = "black";
                                                    text2.fontSize = 19;
                                                    text2.height = "40px";
                                                    rect3.addControl(text2);
                                                }
                                            });
                                        rect1.addControl(dailyMeshes[6]);
                                        // **** پایان ایجاد کلید رفتن به روز قبل **** **** شروع ایجاد کلید رفتن به ماه
                                        // قبل ****
                                        dailyMeshes[7] = new GUI.TextBlock();
                                        dailyMeshes[7].text = "<";
                                        dailyMeshes[7].color = "#244575";
                                        dailyMeshes[7].topInPixels = -265;
                                        dailyMeshes[7].leftInPixels = -80;
                                        dailyMeshes[7].fontSize = 28;
                                        dailyMeshes[7].width = "20px";
                                        dailyMeshes[7].height = "100px";
                                        dailyMeshes[7]
                                            .onPointerClickObservable
                                            .add(() => {
                                                toDay.setMonth(toDay.getMonth() - 1);
                                                let perDate = jalaali.toJalaali(
                                                    toDay.getFullYear(),
                                                    (toDay.getMonth() + 1),
                                                    toDay.getDate()
                                                );
                                                dailyMeshes[1].text = perDate.jy + "/" + perDate.jm + "/" + perDate.jd;
                                                for (i = 0; i < daily.length; i++) {
                                                    if (daily[i][0].date == String(toDay.getFullYear()) + "-" + String(
                                                        toDay.getMonth()
                                                    ) + "-" + String(toDay.getDate())) {
                                                        break;
                                                    }
                                                }
                                                dailyMeshes[3].dispose();
                                                if (i != daily.length) {
                                                    dailyMeshes[3] = new GUI.ScrollViewer();
                                                    dailyMeshes[3].width = "360px";
                                                    dailyMeshes[3].height = "550px";
                                                    dailyMeshes[3].topInPixels = 25;
                                                    dailyMeshes[3].background = "orange";
                                                    dailyMeshes[3].barColor = "black";
                                                    rect1.addControl(dailyMeshes[3]);
                                                    dailyMeshes[4] = new GUI.Rectangle();
                                                    dailyMeshes[4].heightInPixels = daily[i].length * 90;
                                                    dailyMeshes[4].thickness = 10;
                                                    dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                                    dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                                    dailyMeshes[4].color = "Orange";
                                                    dailyMeshes[4].background = "Orange";
                                                    dailyMeshes[3].addControl(dailyMeshes[4]);
                                                    for (let j = 0; j < daily[i].length; j++) {
                                                        let rect3 = new GUI.Rectangle();
                                                        rect3.cornerRadius = 15;
                                                        rect3.height = "90px";
                                                        rect3.color = "Orange";
                                                        rect3.thickness = 4;
                                                        rect3.topInPixels = ((-1 * ((daily[i].length * 90) / 2)) + j * 90) + 45;
                                                        rect3.background = "white";
                                                        dailyMeshes[4].addControl(rect3);
                                                        let text2 = new GUI.TextBlock();
                                                        text2.text = "از";
                                                        text2.color = "black";
                                                        text2.fontSize = 19;
                                                        text2.topInPixels = -20;
                                                        text2.leftInPixels = 120;
                                                        text2.width = "30px";
                                                        text2.height = "40px";
                                                        rect3.addControl(text2);
                                                        let text3 = new GUI.TextBlock();
                                                        text3.text = daily[i][j].startHour + " : " + daily[i][j].startMinute;
                                                        text3.color = "#fc670a";
                                                        text3.topInPixels = -20;
                                                        text3.fontSize = 19;
                                                        text3.leftInPixels = 80;
                                                        text3.width = "60px";
                                                        text3.height = "40px";
                                                        rect3.addControl(text3);
                                                        let text6 = new GUI.TextBlock();
                                                        text6.text = "تا";
                                                        text6.color = "black";
                                                        text6.fontSize = 19;
                                                        text6.topInPixels = -20;
                                                        text6.leftInPixels = 40;
                                                        text6.width = "50px";
                                                        text6.height = "40px";
                                                        rect3.addControl(text6);
                                                        let endHour = daily[i][j].hourDuration + daily[i][j].startHour
                                                        let endMinute = daily[i][j].minutesDuration + daily[i][j].startMinute
                                                        while (endMinute / 60 >= 1) {
                                                            endHour = endHour + 1;
                                                            endMinute = endMinute - 60;
                                                        }
                                                        let text7 = new GUI.TextBlock();
                                                        text7.text = Math.floor(endHour) + " : " + Math.floor(endMinute);
                                                        text7.color = "#fc670a";
                                                        text7.fontSize = 19;
                                                        text7.topInPixels = -20;
                                                        text7.leftInPixels = 0;
                                                        text7.width = "60px";
                                                        text7.height = "40px";
                                                        rect3.addControl(text7);
                                                        let text14 = new GUI.TextBlock();
                                                        text14.text = "به مدت";
                                                        text14.color = "black";
                                                        text14.fontSize = 19;
                                                        text14.leftInPixels = -55;
                                                        text14.width = "50px";
                                                        text14.topInPixels = -20;
                                                        text14.height = "40px";
                                                        rect3.addControl(text14);
                                                        let text15 = new GUI.TextBlock();
                                                        text15.text = Math.floor(daily[i][j].hourDuration) + " : " + Math.floor(
                                                            daily[i][j].minutesDuration
                                                        );
                                                        text15.color = "#fc670a";
                                                        text15.fontSize = 19;
                                                        text15.leftInPixels = -110;
                                                        text15.width = "60px";
                                                        text15.topInPixels = -20;
                                                        text15.height = "40px";
                                                        rect3.addControl(text15);
                                                        let text11 = new GUI.TextBlock();
                                                        text11.text = "مشغول انجام کار";
                                                        text11.color = "black";
                                                        text11.fontSize = 19;
                                                        text11.topInPixels = 18;
                                                        text11.leftInPixels = 95;
                                                        text11.width = "120px";
                                                        text11.height = "40px";
                                                        rect3.addControl(text11);
                                                        let text12 = new GUI.TextBlock();
                                                        text12.text = daily[i][j].task;
                                                        text12.color = "#fc670a";
                                                        text12.fontSize = 19;
                                                        text12.topInPixels = 18;
                                                        text12.leftInPixels = -40;
                                                        text12.width = "150px";
                                                        text12.height = "40px";
                                                        rect3.addControl(text12);
                                                        let text13 = new GUI.TextBlock();
                                                        text13.text = "بودی";
                                                        text13.color = "black";
                                                        text13.fontSize = 19;
                                                        text13.topInPixels = 18;
                                                        text13.leftInPixels = -135;
                                                        text13.width = "105px";
                                                        text13.height = "40px";
                                                        rect3.addControl(text13);
                                                    }
                                                } else {
                                                    dailyMeshes[3] = new GUI.ScrollViewer();
                                                    dailyMeshes[3].width = "390px";
                                                    dailyMeshes[3].height = "550px";
                                                    dailyMeshes[3].topInPixels = 25;
                                                    dailyMeshes[3].background = "orange";
                                                    rect1.addControl(dailyMeshes[3]);
                                                    dailyMeshes[4] = new GUI.Rectangle();
                                                    dailyMeshes[4].adaptHeightToChildren = true;
                                                    dailyMeshes[4].thickness = 10;
                                                    dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                                    dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                                    dailyMeshes[4].color = "Orange";
                                                    dailyMeshes[4].background = "Orange";
                                                    dailyMeshes[3].addControl(dailyMeshes[4]);
                                                    let rect3 = new GUI.Rectangle();
                                                    rect3.cornerRadius = 20;
                                                    rect3.height = "90px";
                                                    rect3.color = "Orange";
                                                    rect3.thickness = 4;
                                                    rect3.topInPixels = 0;
                                                    rect3.background = "white";
                                                    dailyMeshes[4].addControl(rect3);
                                                    let text2 = new GUI.TextBlock();
                                                    text2.text = "امروز هیچکار نکردی";
                                                    text2.color = "black";
                                                    text2.fontSize = 19;
                                                    text2.height = "40px";
                                                    rect3.addControl(text2);
                                                }
                                            });
                                        rect1.addControl(dailyMeshes[7]);
                                        // **** پایان ایجاد کلید رفتن به ماه قبل ****
                                        dailyMeshes[3] = new GUI.ScrollViewer();
                                        dailyMeshes[3].width = "390px";
                                        dailyMeshes[3].height = "550px";
                                        dailyMeshes[3].topInPixels = 25;
                                        dailyMeshes[3].background = "orange";
                                        rect1.addControl(dailyMeshes[3]);
                                        dailyMeshes[4] = new GUI.Rectangle();
                                        dailyMeshes[4].heightInPixels = daily[i].length * 90;
                                        dailyMeshes[4].thickness = 10;
                                        dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                        dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                        dailyMeshes[4].color = "Orange";
                                        dailyMeshes[4].background = "Orange";
                                        dailyMeshes[3].addControl(dailyMeshes[4]);
                                        for (i = 0; i < daily.length; i++) {
                                            if (daily[i][0].date == String(toDay.getFullYear()) + "-" + String(
                                                toDay.getMonth()
                                            ) + "-" + String(toDay.getDate())) {
                                                break;
                                            }
                                        }
                                        if (i != daily.length) {
                                            dailyMeshes[3] = new GUI.ScrollViewer();
                                            dailyMeshes[3].width = "360px";
                                            dailyMeshes[3].height = "550px";
                                            dailyMeshes[3].topInPixels = 25;
                                            dailyMeshes[3].background = "orange";
                                            dailyMeshes[3].barColor = "black";
                                            rect1.addControl(dailyMeshes[3]);
                                            dailyMeshes[4] = new GUI.Rectangle();
                                            dailyMeshes[4].heightInPixels = daily[i].length * 90;
                                            dailyMeshes[4].thickness = 10;
                                            dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                            dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                            dailyMeshes[4].color = "Orange";
                                            dailyMeshes[4].background = "Orange";
                                            dailyMeshes[3].addControl(dailyMeshes[4]);
                                            for (let j = 0; j < daily[i].length; j++) {
                                                let rect3 = new GUI.Rectangle();
                                                rect3.cornerRadius = 15;
                                                rect3.height = "90px";
                                                rect3.color = "Orange";
                                                rect3.thickness = 4;
                                                rect3.topInPixels = ((-1 * ((daily[i].length * 90) / 2)) + j * 90) + 45;
                                                rect3.background = "white";
                                                dailyMeshes[4].addControl(rect3);
                                                let text2 = new GUI.TextBlock();
                                                text2.text = "از";
                                                text2.color = "black";
                                                text2.fontSize = 19;
                                                text2.topInPixels = -20;
                                                text2.leftInPixels = 120;
                                                text2.width = "30px";
                                                text2.height = "40px";
                                                rect3.addControl(text2);
                                                let text3 = new GUI.TextBlock();
                                                text3.text = daily[i][j].startHour + " : " + daily[i][j].startMinute;
                                                text3.color = "#fc670a";
                                                text3.topInPixels = -20;
                                                text3.fontSize = 19;
                                                text3.leftInPixels = 80;
                                                text3.width = "60px";
                                                text3.height = "40px";
                                                rect3.addControl(text3);
                                                let text6 = new GUI.TextBlock();
                                                text6.text = "تا";
                                                text6.color = "black";
                                                text6.fontSize = 19;
                                                text6.topInPixels = -20;
                                                text6.leftInPixels = 40;
                                                text6.width = "50px";
                                                text6.height = "40px";
                                                rect3.addControl(text6);
                                                let endHour = daily[i][j].hourDuration + daily[i][j].startHour
                                                let endMinute = daily[i][j].minutesDuration + daily[i][j].startMinute
                                                while (endMinute / 60 >= 1) {
                                                    endHour = endHour + 1;
                                                    endMinute = endMinute - 60;
                                                }
                                                let text7 = new GUI.TextBlock();
                                                text7.text = Math.floor(endHour) + " : " + Math.floor(endMinute);
                                                text7.color = "#fc670a";
                                                text7.fontSize = 19;
                                                text7.topInPixels = -20;
                                                text7.leftInPixels = 0;
                                                text7.width = "60px";
                                                text7.height = "40px";
                                                rect3.addControl(text7);
                                                let text14 = new GUI.TextBlock();
                                                text14.text = "به مدت";
                                                text14.color = "black";
                                                text14.fontSize = 19;
                                                text14.leftInPixels = -55;
                                                text14.width = "50px";
                                                text14.topInPixels = -20;
                                                text14.height = "40px";
                                                rect3.addControl(text14);
                                                let text15 = new GUI.TextBlock();
                                                text15.text = Math.floor(daily[i][j].hourDuration) + " : " + Math.floor(
                                                    daily[i][j].minutesDuration
                                                );
                                                text15.color = "#fc670a";
                                                text15.fontSize = 19;
                                                text15.leftInPixels = -110;
                                                text15.width = "60px";
                                                text15.topInPixels = -20;
                                                text15.height = "40px";
                                                rect3.addControl(text15);
                                                let text11 = new GUI.TextBlock();
                                                text11.text = "مشغول انجام کار";
                                                text11.color = "black";
                                                text11.fontSize = 19;
                                                text11.topInPixels = 18;
                                                text11.leftInPixels = 95;
                                                text11.width = "120px";
                                                text11.height = "40px";
                                                rect3.addControl(text11);
                                                let text12 = new GUI.TextBlock();
                                                text12.text = daily[i][j].task;
                                                text12.color = "#fc670a";
                                                text12.fontSize = 19;
                                                text12.topInPixels = 18;
                                                text12.leftInPixels = -40;
                                                text12.width = "150px";
                                                text12.height = "40px";
                                                rect3.addControl(text12);
                                                let text13 = new GUI.TextBlock();
                                                text13.text = "بودی";
                                                text13.color = "black";
                                                text13.fontSize = 19;
                                                text13.topInPixels = 18;
                                                text13.leftInPixels = -135;
                                                text13.width = "105px";
                                                text13.height = "40px";
                                                rect3.addControl(text13);
                                            }
                                        } else {
                                            dailyMeshes[3] = new GUI.ScrollViewer();
                                            dailyMeshes[3].width = "390px";
                                            dailyMeshes[3].height = "550px";
                                            dailyMeshes[3].topInPixels = 25;
                                            dailyMeshes[3].background = "orange";
                                            rect1.addControl(dailyMeshes[3]);
                                            dailyMeshes[4] = new GUI.Rectangle();
                                            dailyMeshes[4].adaptHeightToChildren = true;
                                            dailyMeshes[4].thickness = 10;
                                            dailyMeshes[4].horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                            dailyMeshes[4].verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                            dailyMeshes[4].color = "Orange";
                                            dailyMeshes[4].background = "Orange";
                                            dailyMeshes[3].addControl(dailyMeshes[4]);
                                            let rect3 = new GUI.Rectangle();
                                            rect3.cornerRadius = 20;
                                            rect3.height = "90px";
                                            rect3.color = "Orange";
                                            rect3.thickness = 4;
                                            rect3.topInPixels = 0;
                                            rect3.background = "white";
                                            dailyMeshes[4].addControl(rect3);
                                            let text2 = new GUI.TextBlock();
                                            text2.text = "امروز هیچکار نکردی";
                                            text2.color = "black";
                                            text2.fontSize = 19;
                                            text2.height = "40px";
                                            rect3.addControl(text2);
                                        }
                                        // **** پایان نمایش تاریخچه روزانه به صورت دیفالت ****
                                    });
                            },),);
                        // **** پایان ایجاد اونت کاغذ نمایش تاریخچه **** **** شروع نمایش مفیدیت اعضا روی
                        // برد ****
                        let advancedTexture3 = GUI
                            .AdvancedDynamicTexture
                            .CreateForMesh(scene.getMeshByName('scoreboard'));
                        let rect1 = new GUI.Rectangle();
                        rect1.cornerRadius = 20;
                        rect1.height = "1000px";
                        rect1.width = "700px";
                        rect1.color = "Orange";
                        rect1.thickness = 4;
                        rect1.background = "white";
                        advancedTexture3.addControl(rect1);
                        let text1 = new GUI.TextBlock();
                        text1.height = "80px";
                        text1.topInPixels = -435;
                        text1.color = "orange";
                        text1.fontSize = 60;
                        text1.text = "عملکرد دوستان"
                        rect1.addControl(text1);
                        let scoreMeshes = [];
                        axios
                            .get(serverAdrs + `/getMofidToDay`)
                            .then(res => {
                                let data = res.data;
                                let newDate1 = new Date();
                                // **** شروع کلید نمایش مفیدیت روزانه اعضا ****
                                text1
                                    .onPointerClickObservable
                                    .add(() => {
                                        for (let c = 0; c < scoreMeshes.length; c++) {
                                            scoreMeshes[c][0].dispose();
                                            scoreMeshes[c][1].dispose();
                                            scoreMeshes[c][2].dispose();
                                        }
                                        text10.dispose();
                                        text12.dispose();
                                        text14.color = "green";
                                        text15.color = "green";
                                        text10 = new GUI.TextBlock();
                                        text10.height = "60px";
                                        text10.width = "20px";
                                        text10.topInPixels = -370;
                                        text10.leftInPixels = 110;
                                        text10.color = "black";
                                        text10.fontSize = 38;
                                        text10.text = ">";
                                        text10
                                            .onPointerClickObservable
                                            .add(() => {
                                                for (let c = 0; c < scoreMeshes.length; c++) {
                                                    scoreMeshes[c][0].dispose();
                                                    scoreMeshes[c][1].dispose();
                                                    scoreMeshes[c][2].dispose();
                                                }
                                                newDate1.setDate(newDate1.getDate() + 1);
                                                let perDate1 = jalaali.toJalaali(
                                                    newDate1.getFullYear(),
                                                    newDate1.getMonth() + 1,
                                                    newDate1.getDate()
                                                );
                                                text9.text = perDate1.jy + "-" + perDate1.jm + "-" + perDate1.jd;
                                                let i = 0;
                                                data = Object.fromEntries(Object.entries(data).sort((a, b) => {
                                                    if (b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                            newDate1.getDate()
                                                        )] && a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                            newDate1.getDate()
                                                        )]) {
                                                        return ((b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                                newDate1.getDate()
                                                            )]['hours'] * 60 + b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                                newDate1.getDate()
                                                            )]['minutes']) - (a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                                newDate1.getDate()
                                                            )]['hours'] * 60 + a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                                newDate1.getDate()
                                                            )]['minutes']));
                                                    } else {
                                                        return (b[1] - a[1]);
                                                    }
                                                }));
                                                for (let x in data) {
                                                    if (data[x][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                            newDate1.getDate()
                                                        )]) {
                                                        scoreMeshes[i] = [];
                                                        scoreMeshes[i][0] = new GUI.Rectangle();
                                                        scoreMeshes[i][0].cornerRadius = 20;
                                                        scoreMeshes[i][0].height = "100px";
                                                        scoreMeshes[i][0].topInPixels = -400 + ((i + 1) * 120);
                                                        scoreMeshes[i][0].width = "650px";
                                                        scoreMeshes[i][0].color = "Orange";
                                                        scoreMeshes[i][0].thickness = 4;
                                                        scoreMeshes[i][0].background = "white";
                                                        rect1.addControl(scoreMeshes[i][0]);
                                                        scoreMeshes[i][1] = new GUI.TextBlock();
                                                        scoreMeshes[i][1].width = "180px";
                                                        scoreMeshes[i][1].height = "90px";
                                                        scoreMeshes[i][1].leftInPixels = 210;
                                                        scoreMeshes[i][1].color = "black";
                                                        if (data[x].online == 1) {
                                                            scoreMeshes[i][1].color = "green";
                                                        }
                                                        scoreMeshes[i][1].fontSize = 50;
                                                        scoreMeshes[i][1].text = x;
                                                        scoreMeshes[i][0].addControl(scoreMeshes[i][1]);
                                                        scoreMeshes[i][2] = new GUI.TextBlock();
                                                        scoreMeshes[i][2].width = "380px";
                                                        scoreMeshes[i][2].height = "90px";
                                                        scoreMeshes[i][2].leftInPixels = -130;
                                                        scoreMeshes[i][2].color = "black";
                                                        scoreMeshes[i][2].fontSize = 38;
                                                        let thisUser = data[x][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                                newDate1.getDate()
                                                            )];
                                                        while (thisUser['minutes'] / 60 >= 1) {
                                                            thisUser['hours'] = thisUser['hours'] + 1;
                                                            thisUser['minutes'] = thisUser['minutes'] - 60;
                                                        }
                                                        scoreMeshes[i][2].text = " امروز " + thisUser['hours'] + " ساعت و " +
                                                                thisUser['minutes'] + " دقیقه";
                                                        scoreMeshes[i][0].addControl(scoreMeshes[i][2]);
                                                        i = i + 1;
                                                    }
                                                }
                                            });
                                        rect1.addControl(text10);
                                        text11 = new GUI.TextBlock();
                                        text11.height = "60px";
                                        text11.width = "20px";
                                        text11.topInPixels = -370;
                                        text11.leftInPixels = 140;
                                        text11.color = "black";
                                        text11.fontSize = 38;
                                        text11.text = ">";
                                        text11
                                            .onPointerClickObservable
                                            .add(() => {
                                                for (let c = 0; c < scoreMeshes.length; c++) {
                                                    scoreMeshes[c][0].dispose();
                                                    scoreMeshes[c][1].dispose();
                                                    scoreMeshes[c][2].dispose();
                                                }
                                                newDate1.setMonth(newDate1.getMonth() + 1);
                                                let perDate1 = jalaali.toJalaali(
                                                    newDate1.getFullYear(),
                                                    newDate1.getMonth() + 1,
                                                    newDate1.getDate()
                                                );
                                                text9.text = perDate1.jy + "-" + perDate1.jm + "-" + perDate1.jd;
                                                let i = 0;
                                                data = Object.fromEntries(Object.entries(data).sort((a, b) => {
                                                    if (b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                            newDate1.getDate()
                                                        )] && a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                            newDate1.getDate()
                                                        )]) {
                                                        return ((b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                                newDate1.getDate()
                                                            )]['hours'] * 60 + b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                                newDate1.getDate()
                                                            )]['minutes']) - (a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                                newDate1.getDate()
                                                            )]['hours'] * 60 + a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                                newDate1.getDate()
                                                            )]['minutes']));
                                                    } else {
                                                        return (b[1] - a[1]);
                                                    }
                                                }));
                                                for (let x in data) {
                                                    if (data[x][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                            newDate1.getDate()
                                                        )]) {
                                                        scoreMeshes[i] = [];
                                                        scoreMeshes[i][0] = new GUI.Rectangle();
                                                        scoreMeshes[i][0].cornerRadius = 20;
                                                        scoreMeshes[i][0].height = "100px";
                                                        scoreMeshes[i][0].topInPixels = -400 + ((i + 1) * 120);
                                                        scoreMeshes[i][0].width = "650px";
                                                        scoreMeshes[i][0].color = "Orange";
                                                        scoreMeshes[i][0].thickness = 4;
                                                        scoreMeshes[i][0].background = "white";
                                                        rect1.addControl(scoreMeshes[i][0]);
                                                        scoreMeshes[i][1] = new GUI.TextBlock();
                                                        scoreMeshes[i][1].width = "180px";
                                                        scoreMeshes[i][1].height = "90px";
                                                        scoreMeshes[i][1].leftInPixels = 210;
                                                        scoreMeshes[i][1].color = "black";
                                                        if (data[x].online == 1) {
                                                            scoreMeshes[i][1].color = "green";
                                                        }
                                                        scoreMeshes[i][1].fontSize = 50;
                                                        scoreMeshes[i][1].text = x;
                                                        scoreMeshes[i][0].addControl(scoreMeshes[i][1]);
                                                        scoreMeshes[i][2] = new GUI.TextBlock();
                                                        scoreMeshes[i][2].width = "380px";
                                                        scoreMeshes[i][2].height = "90px";
                                                        scoreMeshes[i][2].leftInPixels = -130;
                                                        scoreMeshes[i][2].color = "black";
                                                        scoreMeshes[i][2].fontSize = 38;
                                                        let thisUser = data[x][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                                newDate1.getDate()
                                                            )];
                                                        while (thisUser['minutes'] / 60 >= 1) {
                                                            thisUser['hours'] = thisUser['hours'] + 1;
                                                            thisUser['minutes'] = thisUser['minutes'] - 60;
                                                        }
                                                        scoreMeshes[i][2].text = " امروز " + thisUser['hours'] + " ساعت و " +
                                                                thisUser['minutes'] + " دقیقه";
                                                        scoreMeshes[i][0].addControl(scoreMeshes[i][2]);
                                                        i = i + 1;
                                                    }
                                                }
                                            });
                                        rect1.addControl(text11);
                                        text12 = new GUI.TextBlock();
                                        text12.height = "60px";
                                        text12.width = "20px";
                                        text12.topInPixels = -370;
                                        text12.leftInPixels = -110;
                                        text12.color = "black";
                                        text12.fontSize = 38;
                                        text12.text = "<";
                                        text12
                                            .onPointerClickObservable
                                            .add(() => {
                                                for (let c = 0; c < scoreMeshes.length; c++) {
                                                    scoreMeshes[c][0].dispose();
                                                    scoreMeshes[c][1].dispose();
                                                    scoreMeshes[c][2].dispose();
                                                }
                                                newDate1.setDate(newDate1.getDate() - 1);
                                                let perDate1 = jalaali.toJalaali(
                                                    newDate1.getFullYear(),
                                                    newDate1.getMonth() + 1,
                                                    newDate1.getDate()
                                                );
                                                text9.text = perDate1.jy + "-" + perDate1.jm + "-" + perDate1.jd;
                                                let i = 0;
                                                data = Object.fromEntries(Object.entries(data).sort((a, b) => {
                                                    if (b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                            newDate1.getDate()
                                                        )] && a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                            newDate1.getDate()
                                                        )]) {
                                                        return ((b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                                newDate1.getDate()
                                                            )]['hours'] * 60 + b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                                newDate1.getDate()
                                                            )]['minutes']) - (a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                                newDate1.getDate()
                                                            )]['hours'] * 60 + a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                                newDate1.getDate()
                                                            )]['minutes']));
                                                    } else {
                                                        return (b[1] - a[1]);
                                                    }
                                                }));
                                                for (let x in data) {
                                                    if (data[x][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                            newDate1.getDate()
                                                        )]) {
                                                        scoreMeshes[i] = [];
                                                        scoreMeshes[i][0] = new GUI.Rectangle();
                                                        scoreMeshes[i][0].cornerRadius = 20;
                                                        scoreMeshes[i][0].height = "100px";
                                                        scoreMeshes[i][0].topInPixels = -400 + ((i + 1) * 120);
                                                        scoreMeshes[i][0].width = "650px";
                                                        scoreMeshes[i][0].color = "Orange";
                                                        scoreMeshes[i][0].thickness = 4;
                                                        scoreMeshes[i][0].background = "white";
                                                        rect1.addControl(scoreMeshes[i][0]);
                                                        scoreMeshes[i][1] = new GUI.TextBlock();
                                                        scoreMeshes[i][1].width = "180px";
                                                        scoreMeshes[i][1].height = "90px";
                                                        scoreMeshes[i][1].leftInPixels = 210;
                                                        scoreMeshes[i][1].color = "black";
                                                        if (data[x].online == 1) {
                                                            scoreMeshes[i][1].color = "green";
                                                        }
                                                        scoreMeshes[i][1].fontSize = 50;
                                                        scoreMeshes[i][1].text = x;
                                                        scoreMeshes[i][0].addControl(scoreMeshes[i][1]);
                                                        scoreMeshes[i][2] = new GUI.TextBlock();
                                                        scoreMeshes[i][2].width = "380px";
                                                        scoreMeshes[i][2].height = "90px";
                                                        scoreMeshes[i][2].leftInPixels = -130;
                                                        scoreMeshes[i][2].color = "black";
                                                        scoreMeshes[i][2].fontSize = 38;
                                                        let thisUser = data[x][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                                newDate1.getDate()
                                                            )];
                                                        while (thisUser['minutes'] / 60 >= 1) {
                                                            thisUser['hours'] = thisUser['hours'] + 1;
                                                            thisUser['minutes'] = thisUser['minutes'] - 60;
                                                        }
                                                        scoreMeshes[i][2].text = " امروز " + thisUser['hours'] + " ساعت و " +
                                                                thisUser['minutes'] + " دقیقه";
                                                        scoreMeshes[i][0].addControl(scoreMeshes[i][2]);
                                                        i = i + 1;
                                                    }
                                                }
                                            });
                                        rect1.addControl(text12);
                                        text13 = new GUI.TextBlock();
                                        text13.height = "60px";
                                        text13.width = "20px";
                                        text13.topInPixels = -370;
                                        text13.leftInPixels = -140;
                                        text13.color = "black";
                                        text13.fontSize = 38;
                                        text13.text = "<";
                                        text13
                                            .onPointerClickObservable
                                            .add(() => {
                                                for (let c = 0; c < scoreMeshes.length; c++) {
                                                    scoreMeshes[c][0].dispose();
                                                    scoreMeshes[c][1].dispose();
                                                    scoreMeshes[c][2].dispose();
                                                }
                                                newDate1.setMonth(newDate1.getMonth() - 1);
                                                let perDate1 = jalaali.toJalaali(
                                                    newDate1.getFullYear(),
                                                    newDate1.getMonth() + 1,
                                                    newDate1.getDate()
                                                );
                                                text9.text = perDate1.jy + "-" + perDate1.jm + "-" + perDate1.jd;
                                                let i = 0;
                                                data = Object.fromEntries(Object.entries(data).sort((a, b) => {
                                                    if (b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                            newDate1.getDate()
                                                        )] && a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                            newDate1.getDate()
                                                        )]) {
                                                        return ((b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                                newDate1.getDate()
                                                            )]['hours'] * 60 + b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                                newDate1.getDate()
                                                            )]['minutes']) - (a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                                newDate1.getDate()
                                                            )]['hours'] * 60 + a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                                newDate1.getDate()
                                                            )]['minutes']));
                                                    } else {
                                                        return (b[1] - a[1]);
                                                    }
                                                }));
                                                for (let x in data) {
                                                    if (data[x][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                            newDate1.getDate()
                                                        )]) {
                                                        scoreMeshes[i] = [];
                                                        scoreMeshes[i][0] = new GUI.Rectangle();
                                                        scoreMeshes[i][0].cornerRadius = 20;
                                                        scoreMeshes[i][0].height = "100px";
                                                        scoreMeshes[i][0].topInPixels = -400 + ((i + 1) * 120);
                                                        scoreMeshes[i][0].width = "650px";
                                                        scoreMeshes[i][0].color = "Orange";
                                                        scoreMeshes[i][0].thickness = 4;
                                                        scoreMeshes[i][0].background = "white";
                                                        rect1.addControl(scoreMeshes[i][0]);
                                                        scoreMeshes[i][1] = new GUI.TextBlock();
                                                        scoreMeshes[i][1].width = "180px";
                                                        scoreMeshes[i][1].height = "90px";
                                                        scoreMeshes[i][1].leftInPixels = 210;
                                                        scoreMeshes[i][1].color = "black";
                                                        if (data[x].online == 1) {
                                                            scoreMeshes[i][1].color = "green";
                                                        }
                                                        scoreMeshes[i][1].fontSize = 50;
                                                        scoreMeshes[i][1].text = x;
                                                        scoreMeshes[i][0].addControl(scoreMeshes[i][1]);
                                                        scoreMeshes[i][2] = new GUI.TextBlock();
                                                        scoreMeshes[i][2].width = "380px";
                                                        scoreMeshes[i][2].height = "90px";
                                                        scoreMeshes[i][2].leftInPixels = -130;
                                                        scoreMeshes[i][2].color = "black";
                                                        scoreMeshes[i][2].fontSize = 38;
                                                        let thisUser = data[x][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                                newDate1.getDate()
                                                            )];
                                                        while (thisUser['minutes'] / 60 >= 1) {
                                                            thisUser['hours'] = thisUser['hours'] + 1;
                                                            thisUser['minutes'] = thisUser['minutes'] - 60;
                                                        }
                                                        scoreMeshes[i][2].text = " امروز " + thisUser['hours'] + " ساعت و " +
                                                                thisUser['minutes'] + " دقیقه";
                                                        scoreMeshes[i][0].addControl(scoreMeshes[i][2]);
                                                        i = i + 1;
                                                    }
                                                }
                                            });
                                        rect1.addControl(text13);
                                        i = 0;
                                        newDate1 = new Date();
                                        let perDate1 = jalaali.toJalaali(
                                            newDate1.getFullYear(),
                                            newDate1.getMonth() + 1,
                                            newDate1.getDate()
                                        );
                                        text9.text = perDate1.jy + "-" + perDate1.jm + "-" + perDate1.jd;
                                        data = Object.fromEntries(Object.entries(data).sort((a, b) => {
                                            if (b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                    newDate1.getDate()
                                                )] && a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                    newDate1.getDate()
                                                )]) {
                                                return ((b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )]['hours'] * 60 + b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )]['minutes']) - (a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )]['hours'] * 60 + a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )]['minutes']));
                                            } else {
                                                return (b[1] - a[1]);
                                            }
                                        }));
                                        for (let x in data) {
                                            if (data[x][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                    newDate1.getDate()
                                                )]) {
                                                scoreMeshes[i] = [];
                                                scoreMeshes[i][0] = new GUI.Rectangle();
                                                scoreMeshes[i][0].cornerRadius = 20;
                                                scoreMeshes[i][0].height = "100px";
                                                scoreMeshes[i][0].topInPixels = -400 + ((i + 1) * 120);
                                                scoreMeshes[i][0].width = "650px";
                                                scoreMeshes[i][0].color = "Orange";
                                                scoreMeshes[i][0].thickness = 4;
                                                scoreMeshes[i][0].background = "white";
                                                rect1.addControl(scoreMeshes[i][0]);
                                                scoreMeshes[i][1] = new GUI.TextBlock();
                                                scoreMeshes[i][1].width = "180px";
                                                scoreMeshes[i][1].height = "90px";
                                                scoreMeshes[i][1].leftInPixels = 210;
                                                scoreMeshes[i][1].color = "black";
                                                if (data[x].online == 1) {
                                                    scoreMeshes[i][1].color = "green";
                                                }
                                                scoreMeshes[i][1].fontSize = 50;
                                                scoreMeshes[i][1].text = x;
                                                scoreMeshes[i][0].addControl(scoreMeshes[i][1]);
                                                scoreMeshes[i][2] = new GUI.TextBlock();
                                                scoreMeshes[i][2].width = "380px";
                                                scoreMeshes[i][2].height = "90px";
                                                scoreMeshes[i][2].leftInPixels = -130;
                                                scoreMeshes[i][2].color = "black";
                                                scoreMeshes[i][2].fontSize = 38;
                                                let thisUser = data[x][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )];
                                                while (thisUser['minutes'] / 60 >= 1) {
                                                    thisUser['hours'] = thisUser['hours'] + 1;
                                                    thisUser['minutes'] = thisUser['minutes'] - 60;
                                                }
                                                scoreMeshes[i][2].text = " امروز " + thisUser['hours'] + " ساعت و " +
                                                        thisUser['minutes'] + " دقیقه";
                                                scoreMeshes[i][0].addControl(scoreMeshes[i][2]);
                                                i = i + 1;
                                            }
                                        }
                                        // **** شروع نمایش هفتگی مفیدیت اعضا با کلید ****
                                        text14 = new GUI.TextBlock();
                                        text14.height = "50px";
                                        text14.topInPixels = -390;
                                        text14.leftInPixels = -260;
                                        text14.width = "95px"
                                        text14.color = "green";
                                        text14.fontSize = 42;
                                        text14.text = "هفتگی";
                                        text14
                                            .onPointerClickObservable
                                            .add(() => {
                                                axios
                                                    .get(serverAdrs + `/getMofidToWeek`)
                                                    .then(res => {
                                                        let data2 = res.data;
                                                        text14.color = "brown";
                                                        for (let c = 0; c < scoreMeshes.length; c++) {
                                                            scoreMeshes[c][0].dispose();
                                                            scoreMeshes[c][1].dispose();
                                                            scoreMeshes[c][2].dispose();
                                                        }
                                                        let perDateArray = data2[0]['date'].split("-");
                                                        let perDate1 = jalaali.toJalaali(
                                                            Number(perDateArray[0]),
                                                            Number(perDateArray[1]) + 1,
                                                            Number(perDateArray[2])
                                                        );
                                                        text9.text = perDate1.jy + "-" + perDate1.jm + "-" + perDate1.jd;
                                                        text10.dispose();
                                                        text11.dispose();
                                                        text12.dispose();
                                                        text13.dispose();
                                                        text10 = new GUI.TextBlock();
                                                        text10.height = "60px";
                                                        text10.width = "20px";
                                                        text10.topInPixels = -370;
                                                        text10.leftInPixels = 110;
                                                        text10.color = "black";
                                                        text10.fontSize = 38;
                                                        text10.text = ">";
                                                        text10.onPointerClickObservable.add(()=>{
                                                            if (k != 0) {
                                                                i = 0;
                                                                k = k - 1;
                                                                let perDateArray2 = data2[k]['date'].split("-");
                                                                let perDate2 = jalaali.toJalaali(
                                                                    Number(perDateArray2[0]),
                                                                    Number(perDateArray2[1]) + 1,
                                                                    Number(perDateArray2[2])
                                                                );
                                                                text9.text = perDate2.jy + "-" + perDate2.jm + "-" + perDate2.jd;
                                                                for (let c = 0; c < scoreMeshes.length; c++) {
                                                                    scoreMeshes[c][0].dispose();
                                                                    scoreMeshes[c][1].dispose();
                                                                    scoreMeshes[c][2].dispose();
                                                                }
                                                                data2[k] = Object.fromEntries(Object.entries(data2[k]).sort((a, b) => {
                                                                    if ((b[1]['minutes'] || b[1]['hours']) && (a[1]['minutes'] || a[1]['hours'])) {
                                                                        return (
                                                                            (b[1]['hours'] * 60 + b[1]['minutes']) - (a[1]['hours'] * 60 + a[1]['minutes'])
                                                                        );
                                                                    } else {
                                                                        return (b[1] - a[1]);
                                                                    }
                                                                }));
                                                                for (let x in data2[k]) {
                                                                    if (x != "date") {
                                                                        scoreMeshes[i] = [];
                                                                        scoreMeshes[i][0] = new GUI.Rectangle();
                                                                        scoreMeshes[i][0].cornerRadius = 20;
                                                                        scoreMeshes[i][0].height = "100px";
                                                                        scoreMeshes[i][0].topInPixels = -400 + ((i + 1) * 120);
                                                                        scoreMeshes[i][0].width = "650px";
                                                                        scoreMeshes[i][0].color = "Orange";
                                                                        scoreMeshes[i][0].thickness = 4;
                                                                        scoreMeshes[i][0].background = "white";
                                                                        rect1.addControl(scoreMeshes[i][0]);
                                                                        scoreMeshes[i][1] = new GUI.TextBlock();
                                                                        scoreMeshes[i][1].width = "180px";
                                                                        scoreMeshes[i][1].height = "90px";
                                                                        scoreMeshes[i][1].leftInPixels = 210;
                                                                        scoreMeshes[i][1].color = "black";
                                                                        scoreMeshes[i][1].fontSize = 50;
                                                                        scoreMeshes[i][1].text = x;
                                                                        scoreMeshes[i][0].addControl(scoreMeshes[i][1]);
                                                                        scoreMeshes[i][2] = new GUI.TextBlock();
                                                                        scoreMeshes[i][2].width = "380px";
                                                                        scoreMeshes[i][2].height = "90px";
                                                                        scoreMeshes[i][2].leftInPixels = -130;
                                                                        scoreMeshes[i][2].color = "black";
                                                                        scoreMeshes[i][2].fontSize = 38;
                                                                        let thisWeek = data2[k];
                                                                        while (thisWeek[x]['minutes'] / 60 >= 1) {
                                                                            thisWeek[x]['hours'] = thisWeek[x]['hours'] + 1;
                                                                            thisWeek[x]['minutes'] = thisWeek[x]['minutes'] - 60;
                                                                        }
                                                                        scoreMeshes[i][2].text = " درهفته " + thisWeek[x]['hours'] + " ساعت و " +
                                                                                thisWeek[x]['minutes'] + " دقیقه";
                                                                        scoreMeshes[i][0].addControl(scoreMeshes[i][2]);
                                                                        i = i + 1;
                                                                    }
                                                                }
                                                            }
                                                        });
                                                        rect1.addControl(text10);
                                                        text12 = new GUI.TextBlock();
                                                        text12.height = "60px";
                                                        text12.width = "20px";
                                                        text12.topInPixels = -370;
                                                        text12.leftInPixels = -110;
                                                        text12.color = "black";
                                                        text12.fontSize = 38;
                                                        text12.text = "<";
                                                        text12.onPointerClickObservable.add(()=>{
                                                            if(data2[k + 1]) {
                                                                k = k + 1;
                                                                i = 0;
                                                                let perDateArray2 = data2[k]['date'].split("-");
                                                                let perDate2 = jalaali.toJalaali(
                                                                    Number(perDateArray2[0]),
                                                                    Number(perDateArray2[1]) + 1,
                                                                    Number(perDateArray2[2])
                                                                );
                                                                text9.text = perDate2.jy + "-" + perDate2.jm + "-" + perDate2.jd;
                                                                for (let c = 0; c < scoreMeshes.length; c++) {
                                                                    scoreMeshes[c][0].dispose();
                                                                    scoreMeshes[c][1].dispose();
                                                                    scoreMeshes[c][2].dispose();
                                                                }
                                                                data2[k] = Object.fromEntries(Object.entries(data2[k]).sort((a, b) => {
                                                                    if ((b[1]['minutes'] || b[1]['hours']) && (a[1]['minutes'] || a[1]['hours'])) {
                                                                        return (
                                                                            (b[1]['hours'] * 60 + b[1]['minutes']) - (a[1]['hours'] * 60 + a[1]['minutes'])
                                                                        );
                                                                    } else {
                                                                        return (b[1] - a[1]);
                                                                    }
                                                                }));
                                                                for (let x in data2[k]) {
                                                                    if (x != "date") {
                                                                        scoreMeshes[i] = [];
                                                                        scoreMeshes[i][0] = new GUI.Rectangle();
                                                                        scoreMeshes[i][0].cornerRadius = 20;
                                                                        scoreMeshes[i][0].height = "100px";
                                                                        scoreMeshes[i][0].topInPixels = -400 + ((i + 1) * 120);
                                                                        scoreMeshes[i][0].width = "650px";
                                                                        scoreMeshes[i][0].color = "Orange";
                                                                        scoreMeshes[i][0].thickness = 4;
                                                                        scoreMeshes[i][0].background = "white";
                                                                        rect1.addControl(scoreMeshes[i][0]);
                                                                        scoreMeshes[i][1] = new GUI.TextBlock();
                                                                        scoreMeshes[i][1].width = "180px";
                                                                        scoreMeshes[i][1].height = "90px";
                                                                        scoreMeshes[i][1].leftInPixels = 210;
                                                                        scoreMeshes[i][1].color = "black";
                                                                        scoreMeshes[i][1].fontSize = 50;
                                                                        scoreMeshes[i][1].text = x;
                                                                        scoreMeshes[i][0].addControl(scoreMeshes[i][1]);
                                                                        scoreMeshes[i][2] = new GUI.TextBlock();
                                                                        scoreMeshes[i][2].width = "380px";
                                                                        scoreMeshes[i][2].height = "90px";
                                                                        scoreMeshes[i][2].leftInPixels = -130;
                                                                        scoreMeshes[i][2].color = "black";
                                                                        scoreMeshes[i][2].fontSize = 38;
                                                                        let thisWeek = data2[k];
                                                                        while (thisWeek[x]['minutes'] / 60 >= 1) {
                                                                            thisWeek[x]['hours'] = thisWeek[x]['hours'] + 1;
                                                                            thisWeek[x]['minutes'] = thisWeek[x]['minutes'] - 60;
                                                                        }
                                                                        scoreMeshes[i][2].text = " درهفته " + thisWeek[x]['hours'] + " ساعت و " +
                                                                                thisWeek[x]['minutes'] + " دقیقه";
                                                                        scoreMeshes[i][0].addControl(scoreMeshes[i][2]);
                                                                        i = i + 1;
                                                                    }
                                                                }
                                                            }
                                                        });
                                                        rect1.addControl(text12);
                                                        let i = 0;
                                                        let k = 0;
                                                        data2[k] = Object.fromEntries(Object.entries(data2[k]).sort((a, b) => {
                                                            if (b[1]['minutes'] && a[1]['minutes']) {
                                                                return (
                                                                    (b[1]['hours'] * 60 + b[1]['minutes']) - (a[1]['hours'] * 60 + a[1]['minutes'])
                                                                );
                                                            } else {
                                                                return (b[1] - a[1]);
                                                            }
                                                        }));
                                                        for (let x in data2[k]) {
                                                            if (x != "date") {
                                                                scoreMeshes[i] = [];
                                                                scoreMeshes[i][0] = new GUI.Rectangle();
                                                                scoreMeshes[i][0].cornerRadius = 20;
                                                                scoreMeshes[i][0].height = "100px";
                                                                scoreMeshes[i][0].topInPixels = -400 + ((i + 1) * 120);
                                                                scoreMeshes[i][0].width = "650px";
                                                                scoreMeshes[i][0].color = "Orange";
                                                                scoreMeshes[i][0].thickness = 4;
                                                                scoreMeshes[i][0].background = "white";
                                                                rect1.addControl(scoreMeshes[i][0]);
                                                                scoreMeshes[i][1] = new GUI.TextBlock();
                                                                scoreMeshes[i][1].width = "180px";
                                                                scoreMeshes[i][1].height = "90px";
                                                                scoreMeshes[i][1].leftInPixels = 210;
                                                                scoreMeshes[i][1].color = "black";
                                                                scoreMeshes[i][1].fontSize = 50;
                                                                scoreMeshes[i][1].text = x;
                                                                scoreMeshes[i][0].addControl(scoreMeshes[i][1]);
                                                                scoreMeshes[i][2] = new GUI.TextBlock();
                                                                scoreMeshes[i][2].width = "380px";
                                                                scoreMeshes[i][2].height = "90px";
                                                                scoreMeshes[i][2].leftInPixels = -130;
                                                                scoreMeshes[i][2].color = "black";
                                                                scoreMeshes[i][2].fontSize = 38;
                                                                let thisWeek = data2[k];
                                                                while (thisWeek[x]['minutes'] / 60 >= 1) {
                                                                    thisWeek[x]['hours'] = thisWeek[x]['hours'] + 1;
                                                                    thisWeek[x]['minutes'] = thisWeek[x]['minutes'] - 60;
                                                                }
                                                                scoreMeshes[i][2].text = " درهفته " + thisWeek[x]['hours'] + " ساعت و " +
                                                                        thisWeek[x]['minutes'] + " دقیقه";
                                                                scoreMeshes[i][0].addControl(scoreMeshes[i][2]);
                                                                i = i + 1;
                                                            }
                                                        }
                                                    });
                                            });
                                        rect1.addControl(text14);
                                        // **** پایان نمایش هفتگی مفیدیت اعضا با کلید ****
                                        // **** شروع نمایش ماهانه مفیدیت اعضا با کلید ****
                                        text15 = new GUI.TextBlock();
                                        text15.height = "50px";
                                        text15.width = "95px";
                                        text15.topInPixels = -390;
                                        text15.leftInPixels = 260;
                                        text15.color = "green";
                                        text15.fontSize = 42;
                                        text15.text = "ماهانه";
                                        text15
                                            .onPointerClickObservable
                                            .add(() => {
                                                axios
                                                    .get(serverAdrs + `/getMofidToMonth`)
                                                    .then(res => {
                                                        let data2 = res.data;
                                                        text15.color = "brown";
                                                        for (let c = 0; c < scoreMeshes.length; c++) {
                                                            scoreMeshes[c][0].dispose();
                                                            scoreMeshes[c][1].dispose();
                                                            scoreMeshes[c][2].dispose();
                                                        }
                                                        let perDateArray = data2[0]['date'].split("-");
                                                        let perDate1 = jalaali.toJalaali(
                                                            Number(perDateArray[0]),
                                                            Number(perDateArray[1]) + 1,
                                                            Number(perDateArray[2])
                                                        );
                                                        text9.text = perDate1.jy + "-" + perDate1.jm;
                                                        text10.dispose();
                                                        text11.dispose();
                                                        text12.dispose();
                                                        text13.dispose();
                                                        let i = 0;
                                                        data2[0] = Object.fromEntries(Object.entries(data2[0]).sort((a, b) => {
                                                            if (b[1]['minutes'] && a[1]['minutes']) {
                                                                return (
                                                                    (b[1]['hours'] * 60 + b[1]['minutes']) - (a[1]['hours'] * 60 + a[1]['minutes'])
                                                                );
                                                            } else {
                                                                return (b[1] - a[1]);
                                                            }
                                                        }));
                                                        for (let x in data2[0]) {
                                                            if (x != "date") {
                                                                scoreMeshes[i] = [];
                                                                scoreMeshes[i][0] = new GUI.Rectangle();
                                                                scoreMeshes[i][0].cornerRadius = 20;
                                                                scoreMeshes[i][0].height = "100px";
                                                                scoreMeshes[i][0].topInPixels = -400 + ((i + 1) * 120);
                                                                scoreMeshes[i][0].width = "650px";
                                                                scoreMeshes[i][0].color = "Orange";
                                                                scoreMeshes[i][0].thickness = 4;
                                                                scoreMeshes[i][0].background = "white";
                                                                rect1.addControl(scoreMeshes[i][0]);
                                                                scoreMeshes[i][1] = new GUI.TextBlock();
                                                                scoreMeshes[i][1].width = "180px";
                                                                scoreMeshes[i][1].height = "90px";
                                                                scoreMeshes[i][1].leftInPixels = 210;
                                                                scoreMeshes[i][1].color = "black";
                                                                scoreMeshes[i][1].fontSize = 50;
                                                                scoreMeshes[i][1].text = x;
                                                                scoreMeshes[i][0].addControl(scoreMeshes[i][1]);
                                                                scoreMeshes[i][2] = new GUI.TextBlock();
                                                                scoreMeshes[i][2].width = "380px";
                                                                scoreMeshes[i][2].height = "90px";
                                                                scoreMeshes[i][2].leftInPixels = -130;
                                                                scoreMeshes[i][2].color = "black";
                                                                scoreMeshes[i][2].fontSize = 38;
                                                                let thisWeek = data2[0];
                                                                while (thisWeek[x]['minutes'] / 60 >= 1) {
                                                                    thisWeek[x]['hours'] = thisWeek[x]['hours'] + 1;
                                                                    thisWeek[x]['minutes'] = thisWeek[x]['minutes'] - 60;
                                                                }
                                                                scoreMeshes[i][2].text = " درماه " + thisWeek[x]['hours'] + " ساعت و " +
                                                                        thisWeek[x]['minutes'] + " دقیقه";
                                                                scoreMeshes[i][0].addControl(scoreMeshes[i][2]);
                                                                i = i + 1;
                                                            }
                                                        }
                                                    });
                                            });
                                        rect1.addControl(text15);
                                        // **** پایان نمایش ماهانه مفیدیت اعضا با کلید ****
                                    })
                                    // **** پایان کلید نمایش مفیدیت روزانه اعضا ****
                                    // **** شروع نمایش روزانه مفیدیت اعضا ****
                                let text9 = new GUI.TextBlock();
                                text9.height = "60px";
                                text9.width = "190px";
                                text9.topInPixels = -370;
                                text9.color = "black";
                                text9.fontSize = 38;
                                let perDate1 = jalaali.toJalaali(
                                    newDate1.getFullYear(),
                                    newDate1.getMonth() + 1,
                                    newDate1.getDate()
                                );
                                text9.text = perDate1.jy + "-" + perDate1.jm + "-" + perDate1.jd;
                                rect1.addControl(text9);
                                let text10 = new GUI.TextBlock();
                                text10.height = "60px";
                                text10.width = "20px";
                                text10.topInPixels = -370;
                                text10.leftInPixels = 110;
                                text10.color = "black";
                                text10.fontSize = 38;
                                text10.text = ">";
                                text10
                                    .onPointerClickObservable
                                    .add(() => {
                                        for (let c = 0; c < scoreMeshes.length; c++) {
                                            scoreMeshes[c][0].dispose();
                                            scoreMeshes[c][1].dispose();
                                            scoreMeshes[c][2].dispose();
                                        }
                                        newDate1.setDate(newDate1.getDate() + 1);
                                        let perDate1 = jalaali.toJalaali(
                                            newDate1.getFullYear(),
                                            newDate1.getMonth() + 1,
                                            newDate1.getDate()
                                        );
                                        text9.text = perDate1.jy + "-" + perDate1.jm + "-" + perDate1.jd;
                                        let i = 0;
                                        data = Object.fromEntries(Object.entries(data).sort((a, b) => {
                                            if (b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                    newDate1.getDate()
                                                )] && a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                    newDate1.getDate()
                                                )]) {
                                                return ((b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )]['hours'] * 60 + b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )]['minutes']) - (a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )]['hours'] * 60 + a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )]['minutes']));
                                            } else {
                                                return (b[1] - a[1]);
                                            }
                                        }));
                                        for (let x in data) {
                                            if (data[x][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                    newDate1.getDate()
                                                )]) {
                                                scoreMeshes[i] = [];
                                                scoreMeshes[i][0] = new GUI.Rectangle();
                                                scoreMeshes[i][0].cornerRadius = 20;
                                                scoreMeshes[i][0].height = "100px";
                                                scoreMeshes[i][0].topInPixels = -400 + ((i + 1) * 120);
                                                scoreMeshes[i][0].width = "650px";
                                                scoreMeshes[i][0].color = "Orange";
                                                scoreMeshes[i][0].thickness = 4;
                                                scoreMeshes[i][0].background = "white";
                                                rect1.addControl(scoreMeshes[i][0]);
                                                scoreMeshes[i][1] = new GUI.TextBlock();
                                                scoreMeshes[i][1].width = "180px";
                                                scoreMeshes[i][1].height = "90px";
                                                scoreMeshes[i][1].leftInPixels = 210;
                                                scoreMeshes[i][1].color = "black";
                                                if (data[x].online == 1) {
                                                    scoreMeshes[i][1].color = "green";
                                                }
                                                scoreMeshes[i][1].fontSize = 50;
                                                scoreMeshes[i][1].text = x;
                                                scoreMeshes[i][0].addControl(scoreMeshes[i][1]);
                                                scoreMeshes[i][2] = new GUI.TextBlock();
                                                scoreMeshes[i][2].width = "380px";
                                                scoreMeshes[i][2].height = "90px";
                                                scoreMeshes[i][2].leftInPixels = -130;
                                                scoreMeshes[i][2].color = "black";
                                                scoreMeshes[i][2].fontSize = 38;
                                                let thisUser = data[x][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )];
                                                while (thisUser['minutes'] / 60 >= 1) {
                                                    thisUser['hours'] = thisUser['hours'] + 1;
                                                    thisUser['minutes'] = thisUser['minutes'] - 60;
                                                }
                                                scoreMeshes[i][2].text = " امروز " + thisUser['hours'] + " ساعت و " +
                                                        thisUser['minutes'] + " دقیقه";
                                                scoreMeshes[i][0].addControl(scoreMeshes[i][2]);
                                                i = i + 1;
                                            }
                                        }
                                    });
                                rect1.addControl(text10);
                                let text11 = new GUI.TextBlock();
                                text11.height = "60px";
                                text11.width = "20px";
                                text11.topInPixels = -370;
                                text11.leftInPixels = 140;
                                text11.color = "black";
                                text11.fontSize = 38;
                                text11.text = ">";
                                text11
                                    .onPointerClickObservable
                                    .add(() => {
                                        for (let c = 0; c < scoreMeshes.length; c++) {
                                            scoreMeshes[c][0].dispose();
                                            scoreMeshes[c][1].dispose();
                                            scoreMeshes[c][2].dispose();
                                        }
                                        newDate1.setMonth(newDate1.getMonth() + 1);
                                        let perDate1 = jalaali.toJalaali(
                                            newDate1.getFullYear(),
                                            newDate1.getMonth() + 1,
                                            newDate1.getDate()
                                        );
                                        text9.text = perDate1.jy + "-" + perDate1.jm + "-" + perDate1.jd;
                                        let i = 0;
                                        data = Object.fromEntries(Object.entries(data).sort((a, b) => {
                                            if (b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                    newDate1.getDate()
                                                )] && a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                    newDate1.getDate()
                                                )]) {
                                                return ((b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )]['hours'] * 60 + b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )]['minutes']) - (a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )]['hours'] * 60 + a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )]['minutes']));
                                            } else {
                                                return (b[1] - a[1]);
                                            }
                                        }));
                                        for (let x in data) {
                                            if (data[x][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                    newDate1.getDate()
                                                )]) {
                                                scoreMeshes[i] = [];
                                                scoreMeshes[i][0] = new GUI.Rectangle();
                                                scoreMeshes[i][0].cornerRadius = 20;
                                                scoreMeshes[i][0].height = "100px";
                                                scoreMeshes[i][0].topInPixels = -400 + ((i + 1) * 120);
                                                scoreMeshes[i][0].width = "650px";
                                                scoreMeshes[i][0].color = "Orange";
                                                scoreMeshes[i][0].thickness = 4;
                                                scoreMeshes[i][0].background = "white";
                                                rect1.addControl(scoreMeshes[i][0]);
                                                scoreMeshes[i][1] = new GUI.TextBlock();
                                                scoreMeshes[i][1].width = "180px";
                                                scoreMeshes[i][1].height = "90px";
                                                scoreMeshes[i][1].leftInPixels = 210;
                                                scoreMeshes[i][1].color = "black";
                                                if (data[x].online == 1) {
                                                    scoreMeshes[i][1].color = "green";
                                                }
                                                scoreMeshes[i][1].fontSize = 50;
                                                scoreMeshes[i][1].text = x;
                                                scoreMeshes[i][0].addControl(scoreMeshes[i][1]);
                                                scoreMeshes[i][2] = new GUI.TextBlock();
                                                scoreMeshes[i][2].width = "380px";
                                                scoreMeshes[i][2].height = "90px";
                                                scoreMeshes[i][2].leftInPixels = -130;
                                                scoreMeshes[i][2].color = "black";
                                                scoreMeshes[i][2].fontSize = 38;
                                                let thisUser = data[x][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )];
                                                while (thisUser['minutes'] / 60 >= 1) {
                                                    thisUser['hours'] = thisUser['hours'] + 1;
                                                    thisUser['minutes'] = thisUser['minutes'] - 60;
                                                }
                                                scoreMeshes[i][2].text = " امروز " + thisUser['hours'] + " ساعت و " +
                                                        thisUser['minutes'] + " دقیقه";
                                                scoreMeshes[i][0].addControl(scoreMeshes[i][2]);
                                                i = i + 1;
                                            }
                                        }
                                    });
                                rect1.addControl(text11);
                                let text12 = new GUI.TextBlock();
                                text12.height = "60px";
                                text12.width = "20px";
                                text12.topInPixels = -370;
                                text12.leftInPixels = -110;
                                text12.color = "black";
                                text12.fontSize = 38;
                                text12.text = "<";
                                text12
                                    .onPointerClickObservable
                                    .add(() => {
                                        for (let c = 0; c < scoreMeshes.length; c++) {
                                            scoreMeshes[c][0].dispose();
                                            scoreMeshes[c][1].dispose();
                                            scoreMeshes[c][2].dispose();
                                        }
                                        newDate1.setDate(newDate1.getDate() - 1);
                                        let perDate1 = jalaali.toJalaali(
                                            newDate1.getFullYear(),
                                            newDate1.getMonth() + 1,
                                            newDate1.getDate()
                                        );
                                        text9.text = perDate1.jy + "-" + perDate1.jm + "-" + perDate1.jd;
                                        let i = 0;
                                        data = Object.fromEntries(Object.entries(data).sort((a, b) => {
                                            if (b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                    newDate1.getDate()
                                                )] && a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                    newDate1.getDate()
                                                )]) {
                                                return ((b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )]['hours'] * 60 + b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )]['minutes']) - (a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )]['hours'] * 60 + a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )]['minutes']));
                                            } else {
                                                return (b[1] - a[1]);
                                            }
                                        }));
                                        for (let x in data) {
                                            if (data[x][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                    newDate1.getDate()
                                                )]) {
                                                scoreMeshes[i] = [];
                                                scoreMeshes[i][0] = new GUI.Rectangle();
                                                scoreMeshes[i][0].cornerRadius = 20;
                                                scoreMeshes[i][0].height = "100px";
                                                scoreMeshes[i][0].topInPixels = -400 + ((i + 1) * 120);
                                                scoreMeshes[i][0].width = "650px";
                                                scoreMeshes[i][0].color = "Orange";
                                                scoreMeshes[i][0].thickness = 4;
                                                scoreMeshes[i][0].background = "white";
                                                rect1.addControl(scoreMeshes[i][0]);
                                                scoreMeshes[i][1] = new GUI.TextBlock();
                                                scoreMeshes[i][1].width = "180px";
                                                scoreMeshes[i][1].height = "90px";
                                                scoreMeshes[i][1].leftInPixels = 210;
                                                scoreMeshes[i][1].color = "black";
                                                if (data[x].online == 1) {
                                                    scoreMeshes[i][1].color = "green";
                                                }
                                                scoreMeshes[i][1].fontSize = 50;
                                                scoreMeshes[i][1].text = x;
                                                scoreMeshes[i][0].addControl(scoreMeshes[i][1]);
                                                scoreMeshes[i][2] = new GUI.TextBlock();
                                                scoreMeshes[i][2].width = "380px";
                                                scoreMeshes[i][2].height = "90px";
                                                scoreMeshes[i][2].leftInPixels = -130;
                                                scoreMeshes[i][2].color = "black";
                                                scoreMeshes[i][2].fontSize = 38;
                                                let thisUser = data[x][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )];
                                                while (thisUser['minutes'] / 60 >= 1) {
                                                    thisUser['hours'] = thisUser['hours'] + 1;
                                                    thisUser['minutes'] = thisUser['minutes'] - 60;
                                                }
                                                scoreMeshes[i][2].text = " امروز " + thisUser['hours'] + " ساعت و " +
                                                        thisUser['minutes'] + " دقیقه";
                                                scoreMeshes[i][0].addControl(scoreMeshes[i][2]);
                                                i = i + 1;
                                            }
                                        }
                                    });
                                rect1.addControl(text12);
                                let text13 = new GUI.TextBlock();
                                text13.height = "60px";
                                text13.width = "20px";
                                text13.topInPixels = -370;
                                text13.leftInPixels = -140;
                                text13.color = "black";
                                text13.fontSize = 38;
                                text13.text = "<";
                                text13
                                    .onPointerClickObservable
                                    .add(() => {
                                        for (let c = 0; c < scoreMeshes.length; c++) {
                                            scoreMeshes[c][0].dispose();
                                            scoreMeshes[c][1].dispose();
                                            scoreMeshes[c][2].dispose();
                                        }
                                        newDate1.setMonth(newDate1.getMonth() - 1);
                                        let perDate1 = jalaali.toJalaali(
                                            newDate1.getFullYear(),
                                            newDate1.getMonth() + 1,
                                            newDate1.getDate()
                                        );
                                        text9.text = perDate1.jy + "-" + perDate1.jm + "-" + perDate1.jd;
                                        let i = 0;
                                        data = Object.fromEntries(Object.entries(data).sort((a, b) => {
                                            if (b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                    newDate1.getDate()
                                                )] && a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                    newDate1.getDate()
                                                )]) {
                                                return ((b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )]['hours'] * 60 + b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )]['minutes']) - (a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )]['hours'] * 60 + a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )]['minutes']));
                                            } else {
                                                return (b[1] - a[1]);
                                            }
                                        }));
                                        for (let x in data) {
                                            if (data[x][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                    newDate1.getDate()
                                                )]) {
                                                scoreMeshes[i] = [];
                                                scoreMeshes[i][0] = new GUI.Rectangle();
                                                scoreMeshes[i][0].cornerRadius = 20;
                                                scoreMeshes[i][0].height = "100px";
                                                scoreMeshes[i][0].topInPixels = -400 + ((i + 1) * 120);
                                                scoreMeshes[i][0].width = "650px";
                                                scoreMeshes[i][0].color = "Orange";
                                                scoreMeshes[i][0].thickness = 4;
                                                scoreMeshes[i][0].background = "white";
                                                rect1.addControl(scoreMeshes[i][0]);
                                                scoreMeshes[i][1] = new GUI.TextBlock();
                                                scoreMeshes[i][1].width = "180px";
                                                scoreMeshes[i][1].height = "90px";
                                                scoreMeshes[i][1].leftInPixels = 210;
                                                scoreMeshes[i][1].color = "black";
                                                if (data[x].online == 1) {
                                                    scoreMeshes[i][1].color = "green";
                                                }
                                                scoreMeshes[i][1].fontSize = 50;
                                                scoreMeshes[i][1].text = x;
                                                scoreMeshes[i][0].addControl(scoreMeshes[i][1]);
                                                scoreMeshes[i][2] = new GUI.TextBlock();
                                                scoreMeshes[i][2].width = "380px";
                                                scoreMeshes[i][2].height = "90px";
                                                scoreMeshes[i][2].leftInPixels = -130;
                                                scoreMeshes[i][2].color = "black";
                                                scoreMeshes[i][2].fontSize = 38;
                                                let thisUser = data[x][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                        newDate1.getDate()
                                                    )];
                                                while (thisUser['minutes'] / 60 >= 1) {
                                                    thisUser['hours'] = thisUser['hours'] + 1;
                                                    thisUser['minutes'] = thisUser['minutes'] - 60;
                                                }
                                                scoreMeshes[i][2].text = " امروز " + thisUser['hours'] + " ساعت و " +
                                                        thisUser['minutes'] + " دقیقه";
                                                scoreMeshes[i][0].addControl(scoreMeshes[i][2]);
                                                i = i + 1;
                                            }
                                        }
                                    });
                                rect1.addControl(text13);
                                let i = 0;
                                data = Object.fromEntries(Object.entries(data).sort((a, b) => {
                                    if (b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                            newDate1.getDate()
                                        )] && a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                            newDate1.getDate()
                                        )]) {
                                        return ((b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                newDate1.getDate()
                                            )]['hours'] * 60 + b[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                newDate1.getDate()
                                            )]['minutes']) - (a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                newDate1.getDate()
                                            )]['hours'] * 60 + a[1][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                newDate1.getDate()
                                            )]['minutes']));
                                    } else {
                                        return (b[1] - a[1]);
                                    }
                                }));
                                for (let x in data) {
                                    if (data[x][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                            newDate1.getDate()
                                        )]) {
                                        scoreMeshes[i] = [];
                                        scoreMeshes[i][0] = new GUI.Rectangle();
                                        scoreMeshes[i][0].cornerRadius = 20;
                                        scoreMeshes[i][0].height = "100px";
                                        scoreMeshes[i][0].topInPixels = -400 + ((i + 1) * 120);
                                        scoreMeshes[i][0].width = "650px";
                                        scoreMeshes[i][0].color = "Orange";
                                        scoreMeshes[i][0].thickness = 4;
                                        scoreMeshes[i][0].background = "white";
                                        rect1.addControl(scoreMeshes[i][0]);
                                        scoreMeshes[i][1] = new GUI.TextBlock();
                                        scoreMeshes[i][1].width = "180px";
                                        scoreMeshes[i][1].height = "90px";
                                        scoreMeshes[i][1].leftInPixels = 210;
                                        scoreMeshes[i][1].color = "black";
                                        if (data[x].online == 1) {
                                            scoreMeshes[i][1].color = "green";
                                        }
                                        scoreMeshes[i][1].fontSize = 50;
                                        scoreMeshes[i][1].text = x;
                                        scoreMeshes[i][0].addControl(scoreMeshes[i][1]);
                                        scoreMeshes[i][2] = new GUI.TextBlock();
                                        scoreMeshes[i][2].width = "380px";
                                        scoreMeshes[i][2].height = "90px";
                                        scoreMeshes[i][2].leftInPixels = -130;
                                        scoreMeshes[i][2].color = "black";
                                        scoreMeshes[i][2].fontSize = 38;
                                        let thisUser = data[x][newDate1.getFullYear() + "-" + newDate1.getMonth() + "-" + (
                                                newDate1.getDate()
                                            )];
                                        while (thisUser['minutes'] / 60 >= 1) {
                                            thisUser['hours'] = thisUser['hours'] + 1;
                                            thisUser['minutes'] = thisUser['minutes'] - 60;
                                        }
                                        scoreMeshes[i][2].text = " امروز " + thisUser['hours'] + " ساعت و " +
                                                thisUser['minutes'] + " دقیقه";
                                        scoreMeshes[i][0].addControl(scoreMeshes[i][2]);
                                        i = i + 1;
                                    }
                                }
                                // **** پایان نمایش روزانه مفیدیت اعضا ****
                                // **** شروع نمایش هفتگی مفیدیت اعضا ****
                                let text14 = new GUI.TextBlock();
                                text14.height = "50px";
                                text14.topInPixels = -390;
                                text14.leftInPixels = -260;
                                text14.width = "95px"
                                text14.color = "green";
                                text14.fontSize = 42;
                                text14.text = "هفتگی";
                                text14
                                    .onPointerClickObservable
                                    .add(() => {
                                        axios
                                            .get(serverAdrs + `/getMofidToWeek`)
                                            .then(res => {
                                                let data2 = res.data;
                                                text14.color = "brown";
                                                for (let c = 0; c < scoreMeshes.length; c++) {
                                                    scoreMeshes[c][0].dispose();
                                                    scoreMeshes[c][1].dispose();
                                                    scoreMeshes[c][2].dispose();
                                                }
                                                let perDateArray = data2[0]['date'].split("-");
                                                let perDate1 = jalaali.toJalaali(
                                                    Number(perDateArray[0]),
                                                    Number(perDateArray[1]) + 1,
                                                    Number(perDateArray[2])
                                                );
                                                text9.text = perDate1.jy + "-" + perDate1.jm + "-" + perDate1.jd;
                                                text10.dispose();
                                                text11.dispose();
                                                text12.dispose();
                                                text13.dispose();
                                                text10 = new GUI.TextBlock();
                                                text10.height = "60px";
                                                text10.width = "20px";
                                                text10.topInPixels = -370;
                                                text10.leftInPixels = 110;
                                                text10.color = "black";
                                                text10.fontSize = 38;
                                                text10.text = ">";
                                                text10.onPointerClickObservable.add(()=>{
                                                    if (k != 0) {
                                                        i = 0;
                                                        k = k - 1;
                                                        let perDateArray2 = data2[k]['date'].split("-");
                                                        let perDate2 = jalaali.toJalaali(
                                                            Number(perDateArray2[0]),
                                                            Number(perDateArray2[1]) + 1,
                                                            Number(perDateArray2[2])
                                                        );
                                                        text9.text = perDate2.jy + "-" + perDate2.jm + "-" + perDate2.jd;
                                                        for (let c = 0; c < scoreMeshes.length; c++) {
                                                            scoreMeshes[c][0].dispose();
                                                            scoreMeshes[c][1].dispose();
                                                            scoreMeshes[c][2].dispose();
                                                        }
                                                        data2[k] = Object.fromEntries(Object.entries(data2[k]).sort((a, b) => {
                                                            if ((b[1]['minutes'] || b[1]['hours']) && (a[1]['minutes'] || a[1]['hours'])) {
                                                                return (
                                                                    (b[1]['hours'] * 60 + b[1]['minutes']) - (a[1]['hours'] * 60 + a[1]['minutes'])
                                                                );
                                                            } else {
                                                                return (b[1] - a[1]);
                                                            }
                                                        }));
                                                        for (let x in data2[k]) {
                                                            if (x != "date") {
                                                                scoreMeshes[i] = [];
                                                                scoreMeshes[i][0] = new GUI.Rectangle();
                                                                scoreMeshes[i][0].cornerRadius = 20;
                                                                scoreMeshes[i][0].height = "100px";
                                                                scoreMeshes[i][0].topInPixels = -400 + ((i + 1) * 120);
                                                                scoreMeshes[i][0].width = "650px";
                                                                scoreMeshes[i][0].color = "Orange";
                                                                scoreMeshes[i][0].thickness = 4;
                                                                scoreMeshes[i][0].background = "white";
                                                                rect1.addControl(scoreMeshes[i][0]);
                                                                scoreMeshes[i][1] = new GUI.TextBlock();
                                                                scoreMeshes[i][1].width = "180px";
                                                                scoreMeshes[i][1].height = "90px";
                                                                scoreMeshes[i][1].leftInPixels = 210;
                                                                scoreMeshes[i][1].color = "black";
                                                                scoreMeshes[i][1].fontSize = 50;
                                                                scoreMeshes[i][1].text = x;
                                                                scoreMeshes[i][0].addControl(scoreMeshes[i][1]);
                                                                scoreMeshes[i][2] = new GUI.TextBlock();
                                                                scoreMeshes[i][2].width = "380px";
                                                                scoreMeshes[i][2].height = "90px";
                                                                scoreMeshes[i][2].leftInPixels = -130;
                                                                scoreMeshes[i][2].color = "black";
                                                                scoreMeshes[i][2].fontSize = 38;
                                                                let thisWeek = data2[k];
                                                                while (thisWeek[x]['minutes'] / 60 >= 1) {
                                                                    thisWeek[x]['hours'] = thisWeek[x]['hours'] + 1;
                                                                    thisWeek[x]['minutes'] = thisWeek[x]['minutes'] - 60;
                                                                }
                                                                scoreMeshes[i][2].text = " درهفته " + thisWeek[x]['hours'] + " ساعت و " +
                                                                        thisWeek[x]['minutes'] + " دقیقه";
                                                                scoreMeshes[i][0].addControl(scoreMeshes[i][2]);
                                                                i = i + 1;
                                                            }
                                                        }
                                                    }
                                                });
                                                rect1.addControl(text10);
                                                text12 = new GUI.TextBlock();
                                                text12.height = "60px";
                                                text12.width = "20px";
                                                text12.topInPixels = -370;
                                                text12.leftInPixels = -110;
                                                text12.color = "black";
                                                text12.fontSize = 38;
                                                text12.text = "<";
                                                text12.onPointerClickObservable.add(()=>{
                                                    if(data2[k + 1]) {
                                                        k = k + 1;
                                                        i = 0;
                                                        let perDateArray2 = data2[k]['date'].split("-");
                                                        let perDate2 = jalaali.toJalaali(
                                                            Number(perDateArray2[0]),
                                                            Number(perDateArray2[1]) + 1,
                                                            Number(perDateArray2[2])
                                                        );
                                                        text9.text = perDate2.jy + "-" + perDate2.jm + "-" + perDate2.jd;
                                                        for (let c = 0; c < scoreMeshes.length; c++) {
                                                            scoreMeshes[c][0].dispose();
                                                            scoreMeshes[c][1].dispose();
                                                            scoreMeshes[c][2].dispose();
                                                        }
                                                        data2[k] = Object.fromEntries(Object.entries(data2[k]).sort((a, b) => {
                                                            if ((b[1]['minutes'] || b[1]['hours']) && (a[1]['minutes'] || a[1]['hours'])) {
                                                                return (
                                                                    (b[1]['hours'] * 60 + b[1]['minutes']) - (a[1]['hours'] * 60 + a[1]['minutes'])
                                                                );
                                                            } else {
                                                                return (b[1] - a[1]);
                                                            }
                                                        }));
                                                        for (let x in data2[k]) {
                                                            if (x != "date") {
                                                                scoreMeshes[i] = [];
                                                                scoreMeshes[i][0] = new GUI.Rectangle();
                                                                scoreMeshes[i][0].cornerRadius = 20;
                                                                scoreMeshes[i][0].height = "100px";
                                                                scoreMeshes[i][0].topInPixels = -400 + ((i + 1) * 120);
                                                                scoreMeshes[i][0].width = "650px";
                                                                scoreMeshes[i][0].color = "Orange";
                                                                scoreMeshes[i][0].thickness = 4;
                                                                scoreMeshes[i][0].background = "white";
                                                                rect1.addControl(scoreMeshes[i][0]);
                                                                scoreMeshes[i][1] = new GUI.TextBlock();
                                                                scoreMeshes[i][1].width = "180px";
                                                                scoreMeshes[i][1].height = "90px";
                                                                scoreMeshes[i][1].leftInPixels = 210;
                                                                scoreMeshes[i][1].color = "black";
                                                                scoreMeshes[i][1].fontSize = 50;
                                                                scoreMeshes[i][1].text = x;
                                                                scoreMeshes[i][0].addControl(scoreMeshes[i][1]);
                                                                scoreMeshes[i][2] = new GUI.TextBlock();
                                                                scoreMeshes[i][2].width = "380px";
                                                                scoreMeshes[i][2].height = "90px";
                                                                scoreMeshes[i][2].leftInPixels = -130;
                                                                scoreMeshes[i][2].color = "black";
                                                                scoreMeshes[i][2].fontSize = 38;
                                                                let thisWeek = data2[k];
                                                                while (thisWeek[x]['minutes'] / 60 >= 1) {
                                                                    thisWeek[x]['hours'] = thisWeek[x]['hours'] + 1;
                                                                    thisWeek[x]['minutes'] = thisWeek[x]['minutes'] - 60;
                                                                }
                                                                scoreMeshes[i][2].text = " درهفته " + thisWeek[x]['hours'] + " ساعت و " +
                                                                        thisWeek[x]['minutes'] + " دقیقه";
                                                                scoreMeshes[i][0].addControl(scoreMeshes[i][2]);
                                                                i = i + 1;
                                                            }
                                                        }
                                                    }
                                                });
                                                rect1.addControl(text12);
                                                let i = 0;
                                                let k = 0;
                                                data2[k] = Object.fromEntries(Object.entries(data2[k]).sort((a, b) => {
                                                    if (b[1]['minutes'] && a[1]['minutes']) {
                                                        return (
                                                            (b[1]['hours'] * 60 + b[1]['minutes']) - (a[1]['hours'] * 60 + a[1]['minutes'])
                                                        );
                                                    } else {
                                                        return (b[1] - a[1]);
                                                    }
                                                }));
                                                for (let x in data2[k]) {
                                                    if (x != "date") {
                                                        scoreMeshes[i] = [];
                                                        scoreMeshes[i][0] = new GUI.Rectangle();
                                                        scoreMeshes[i][0].cornerRadius = 20;
                                                        scoreMeshes[i][0].height = "100px";
                                                        scoreMeshes[i][0].topInPixels = -400 + ((i + 1) * 120);
                                                        scoreMeshes[i][0].width = "650px";
                                                        scoreMeshes[i][0].color = "Orange";
                                                        scoreMeshes[i][0].thickness = 4;
                                                        scoreMeshes[i][0].background = "white";
                                                        rect1.addControl(scoreMeshes[i][0]);
                                                        scoreMeshes[i][1] = new GUI.TextBlock();
                                                        scoreMeshes[i][1].width = "180px";
                                                        scoreMeshes[i][1].height = "90px";
                                                        scoreMeshes[i][1].leftInPixels = 210;
                                                        scoreMeshes[i][1].color = "black";
                                                        scoreMeshes[i][1].fontSize = 50;
                                                        scoreMeshes[i][1].text = x;
                                                        scoreMeshes[i][0].addControl(scoreMeshes[i][1]);
                                                        scoreMeshes[i][2] = new GUI.TextBlock();
                                                        scoreMeshes[i][2].width = "380px";
                                                        scoreMeshes[i][2].height = "90px";
                                                        scoreMeshes[i][2].leftInPixels = -130;
                                                        scoreMeshes[i][2].color = "black";
                                                        scoreMeshes[i][2].fontSize = 38;
                                                        let thisWeek = data2[k];
                                                        while (thisWeek[x]['minutes'] / 60 >= 1) {
                                                            thisWeek[x]['hours'] = thisWeek[x]['hours'] + 1;
                                                            thisWeek[x]['minutes'] = thisWeek[x]['minutes'] - 60;
                                                        }
                                                        scoreMeshes[i][2].text = " درهفته " + thisWeek[x]['hours'] + " ساعت و " +
                                                                thisWeek[x]['minutes'] + " دقیقه";
                                                        scoreMeshes[i][0].addControl(scoreMeshes[i][2]);
                                                        i = i + 1;
                                                    }
                                                }
                                            });
                                    });
                                rect1.addControl(text14);
                                // **** پایان نمایش هفتگی مفیدیت اعضا ****
                                // **** شروع نمایش ماهانه مفیدیت اعضا ****
                                let text15 = new GUI.TextBlock();
                                text15.height = "50px";
                                text15.width = "95px";
                                text15.topInPixels = -390;
                                text15.leftInPixels = 260;
                                text15.color = "green";
                                text15.fontSize = 42;
                                text15.text = "ماهانه";
                                text15
                                    .onPointerClickObservable
                                    .add(() => {
                                        axios
                                            .get(serverAdrs + `/getMofidToMonth`)
                                            .then(res => {
                                                let data2 = res.data;
                                                text15.color = "brown";
                                                for (let c = 0; c < scoreMeshes.length; c++) {
                                                    scoreMeshes[c][0].dispose();
                                                    scoreMeshes[c][1].dispose();
                                                    scoreMeshes[c][2].dispose();
                                                }
                                                let perDateArray = data2[0]['date'].split("-");
                                                let perDate1 = jalaali.toJalaali(
                                                    Number(perDateArray[0]),
                                                    Number(perDateArray[1]) + 1,
                                                    Number(perDateArray[2])
                                                );
                                                text9.text = perDate1.jy + "-" + perDate1.jm;
                                                text10.dispose();
                                                text11.dispose();
                                                text12.dispose();
                                                text13.dispose();
                                                let i = 0;
                                                data2[0] = Object.fromEntries(Object.entries(data2[0]).sort((a, b) => {
                                                    if (b[1]['minutes'] && a[1]['minutes']) {
                                                        return (
                                                            (b[1]['hours'] * 60 + b[1]['minutes']) - (a[1]['hours'] * 60 + a[1]['minutes'])
                                                        );
                                                    } else {
                                                        return (b[1] - a[1]);
                                                    }
                                                }));
                                                for (let x in data2[0]) {
                                                    if (x != "date") {
                                                        scoreMeshes[i] = [];
                                                        scoreMeshes[i][0] = new GUI.Rectangle();
                                                        scoreMeshes[i][0].cornerRadius = 20;
                                                        scoreMeshes[i][0].height = "100px";
                                                        scoreMeshes[i][0].topInPixels = -400 + ((i + 1) * 120);
                                                        scoreMeshes[i][0].width = "650px";
                                                        scoreMeshes[i][0].color = "Orange";
                                                        scoreMeshes[i][0].thickness = 4;
                                                        scoreMeshes[i][0].background = "white";
                                                        rect1.addControl(scoreMeshes[i][0]);
                                                        scoreMeshes[i][1] = new GUI.TextBlock();
                                                        scoreMeshes[i][1].width = "180px";
                                                        scoreMeshes[i][1].height = "90px";
                                                        scoreMeshes[i][1].leftInPixels = 210;
                                                        scoreMeshes[i][1].color = "black";
                                                        scoreMeshes[i][1].fontSize = 50;
                                                        scoreMeshes[i][1].text = x;
                                                        scoreMeshes[i][0].addControl(scoreMeshes[i][1]);
                                                        scoreMeshes[i][2] = new GUI.TextBlock();
                                                        scoreMeshes[i][2].width = "380px";
                                                        scoreMeshes[i][2].height = "90px";
                                                        scoreMeshes[i][2].leftInPixels = -130;
                                                        scoreMeshes[i][2].color = "black";
                                                        scoreMeshes[i][2].fontSize = 38;
                                                        let thisWeek = data2[0];
                                                        while (thisWeek[x]['minutes'] / 60 >= 1) {
                                                            thisWeek[x]['hours'] = thisWeek[x]['hours'] + 1;
                                                            thisWeek[x]['minutes'] = thisWeek[x]['minutes'] - 60;
                                                        }
                                                        scoreMeshes[i][2].text = " درماه " + thisWeek[x]['hours'] + " ساعت و " +
                                                                thisWeek[x]['minutes'] + " دقیقه";
                                                        scoreMeshes[i][0].addControl(scoreMeshes[i][2]);
                                                        i = i + 1;
                                                    }
                                                }
                                            });
                                    });
                                rect1.addControl(text15);
                                // **** پایان نمایش ماهانه مفیدیت اعضا ****
                            });
                        // const bordInterval = setInterval(()=> {     axios     .get(serverAdrs +
                        // `/getMofidToDay`)     .then(res => {         let data = res.data;         let
                        // i = 0;         for (let x in data) {             scoreMeshes[i][1].color =
                        // "black";             if (data[x].online == 1) {
                        // scoreMeshes[i][1].color = "green";             }
                        // scoreMeshes[i][1].text = x;             while (data[x]['minutes'] / 60 >= 1)
                        // {                 data[x]['hours'] = data[x]['hours'] + 1;
                        // data[x]['minutes'] = data[x]['minutes'] - 60;             }
                        // scoreMeshes[i][2].text = " امروز " + data[x]['hours'] + " ساعت و " +
                        // data[x]['minutes'] +                     " دقیقه";             i = i + 1;
                        // }     }); }, 60000) **** پایان نمایش مفیدیت اعضا روی برد **** **** شروع نمایش
                        // فرم کار جدید روی برد ****
                        let advancedTexture4 = GUI
                            .AdvancedDynamicTexture
                            .CreateForMesh(scene.getMeshByName('jobsboard'));
                        let rect2 = new GUI.Rectangle();
                        rect2.cornerRadius = 20;
                        rect2.height = "950px";
                        rect2.width = "1100px";
                        rect2.color = "Orange";
                        rect2.thickness = 4;
                        rect2.background = "white";
                        advancedTexture4.addControl(rect2);
                        let text2 = new GUI.TextBlock();
                        text2.height = "100px";
                        text2.topInPixels = -400
                        text2.color = "black";
                        text2.fontSize = 60;
                        text2.text = " : کار های امروز"
                        rect2.addControl(text2);
                        let scoreMeshes2 = [];
                        let paramsToSend3 = new URLSearchParams();
                        paramsToSend3.append("user", cookies.user);
                        axios
                            .get(serverAdrs + `/getJobsToDay?` + paramsToSend3.toString())
                            .then(res => {
                                let data = res.data;
                                let i = 0;
                                data.forEach((value) => {
                                    scoreMeshes2[i] = new GUI.TextBlock();
                                    scoreMeshes2[i].height = "100px";
                                    scoreMeshes2[i].topInPixels = -285 + (i * 100);
                                    scoreMeshes2[i].color = "black";
                                    scoreMeshes2[i].fontSize = 60;
                                    scoreMeshes2[i].text = value.name;
                                    rect2.addControl(scoreMeshes2[i]);
                                    i = i + 1;
                                })
                            });
                        let advancedTexture5 = GUI
                            .AdvancedDynamicTexture
                            .CreateForMesh(scene.getMeshByName('addjobboard'));
                        let rect3 = new GUI.Rectangle();
                        rect3.cornerRadius = 20;
                        rect3.height = "800px";
                        rect3.width = "950px";
                        rect3.color = "Orange";
                        rect3.thickness = 4;
                        rect3.background = "white";
                        advancedTexture5.addControl(rect3);
                        let text3 = new GUI.TextBlock();
                        text3.height = "100px";
                        text3.topInPixels = -330
                        text3.leftInPixels = 300
                        text3.color = "black";
                        text3.fontSize = 60;
                        text3.text = " : اسم کار";
                        rect3.addControl(text3);
                        let input = new GUI.InputText();
                        input.maxWidth = "550px";
                        input.height = "100px";
                        input.color = "black";
                        input.topInPixels = -330;
                        input.leftInPixels = -150
                        input.background = "orange";
                        input.placeholderText = "اسم کارتو اینجا بنویس";
                        input.focusedBackground = "orange";
                        input.placeholderColor = "black";
                        input.autoStretchWidth = true;
                        input.fontSize = 45;
                        rect3.addControl(input);
                        let rect9 = new GUI.Rectangle();
                        rect9.cornerRadius = 5;
                        rect9.height = "80px";
                        rect9.width = "400px";
                        rect9.topInPixels = -220;
                        rect9.leftInPixels = -150
                        rect9.color = "Orange";
                        rect9.thickness = 4;
                        rect9.background = "orange";
                        rect9.onPointerClickObservable.add(()=>{
                            let paramsToSend = new URLSearchParams();
                            paramsToSend.append("user", cookies.user);
                            axios
                                .get(serverAdrs + `/getJobs?` + paramsToSend.toString())
                                .then(res => {
                                    let tasks = res.data;
                                    let i = 0;
                                    let rect10 = new GUI.ScrollViewer();
                                    rect10.width = "670px";
                                    if (Object.keys(tasks).length < 5) {
                                        rect10.heightInPixels =Object.keys(tasks).length * 105
                                    }
                                    else {
                                        rect10.heightInPixels = 405;
                                    }
                                    rect10.isPointerBlocker = true;
                                    rect10.background = "orange";
                                    rect3.addControl(rect10);
                                    let rect11 = new GUI.Rectangle();
                                    rect11.heightInPixels = Object.keys(tasks).length * 100;
                                    rect11.thickness = 10;
                                    rect11.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                    rect11.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                    rect11.color = "Orange";
                                    rect11.background = "Orange";
                                    rect10.addControl(rect11);
                                    for (let x in tasks) {
                                        let rect12 = new GUI.Rectangle();
                                        rect12.cornerRadius = 20;
                                        rect12.height = "100px";
                                        rect12.color = "Orange";
                                        rect12.thickness = 4;
                                        rect12.topInPixels = ((-1 * ((Object.keys(tasks).length * 100) / 2)) + i * 100) + 50;
                                        rect12.background = "white";
                                        rect12.onPointerClickObservable.add(()=>{
                                            input.text = tasks[x].name;
                                            rect10.dispose();
                                        });
                                        rect11.addControl(rect12);
                                        let text8 = new GUI.TextBlock();
                                        text8.text = tasks[x].name;
                                        text8.color = "black";
                                        text8.fontSize = 52;
                                        rect12.addControl(text8);
                                        i = i + 1;
                                    }
                                });
                        });
                        rect3.addControl(rect9);
                        let text9 = new GUI.TextBlock();
                        text9.text = "انتخاب از لیست کار ها";
                        text9.color = "black";
                        text9.fontSize = 48;
                        rect9.addControl(text9);
                        let text5 = new GUI.TextBlock();
                        text5.height = "100px";
                        text5.topInPixels = -110;
                        text5.leftInPixels = 300;
                        text5.color = "black";
                        text5.fontSize = 60;
                        text5.text = " : زمان";
                        rect3.addControl(text5);
                        let input3 = new GUI.InputText();
                        input3.maxWidth = "550px";
                        input3.height = "100px";
                        input3.color = "black";
                        input3.topInPixels = -110;
                        input3.leftInPixels = -150
                        input3.background = "orange";
                        input3.placeholderText = "format : 03:07 or 3:7";
                        input3.focusedBackground = "orange";
                        input3.placeholderColor = "black";
                        input3.autoStretchWidth = true;
                        input3.isReadOnly = true;
                        input3.fontSize = 45;
                        rect3.addControl(input3);
                        let input4;
                        let rect4 = new GUI.Rectangle();
                        rect4.cornerRadius = 20;
                        rect4.height = "100px";
                        rect4.topInPixels = 150;
                        rect4.width = "350px";
                        rect4.color = "Orange";
                        rect4.thickness = 4;
                        rect4.background = "orange";
                        rect4
                            .onPointerClickObservable
                            .add(() => {
                                let paramsToSend4 = new URLSearchParams();
                                paramsToSend4.append("user", cookies.user);
                                paramsToSend4.append("name", input.text);
                                if (input4) {
                                    let perDateArray = input4
                                        .text
                                        .split("-");
                                    let perDate = jalaali.toGregorian(
                                        Number(perDateArray[0]),
                                        Number(perDateArray[1]),
                                        Number(perDateArray[2])
                                    );
                                    paramsToSend4.append(
                                        "date",
                                        String(perDate.gy) + "-" + String(perDate.gm) + "-" + String(perDate.gd)
                                    );
                                    input4.text = "";
                                }
                                input.text = "";
                                axios
                                    .get(serverAdrs + `/addNewTaskWithDate?` + paramsToSend4.toString())
                                    .then(res => {
                                        let data = res.data;
                                    });
                            });
                        rect3.addControl(rect4);
                        let text8 = new GUI.TextBlock();
                        text8.height = "100px";
                        text8.color = "black";
                        text8.fontSize = 50;
                        text8.text = "ذخیره برای فردا";
                        rect4.addControl(text8);
                        let checkbox = new GUI.Checkbox();
                        checkbox.width = "50px";
                        checkbox.height = "50px";
                        checkbox.topInPixels = 20;
                        checkbox.leftInPixels = 270;
                        checkbox.isChecked = false;
                        checkbox.color = "orange";
                        let text7;
                        checkbox
                            .onIsCheckedChangedObservable
                            .add(function (value) {
                                if (value == true) {
                                    text7 = new GUI.TextBlock();
                                    text7.height = "100px";
                                    text7.topInPixels = 150;
                                    text7.leftInPixels = 300;
                                    text7.color = "black";
                                    text7.fontSize = 60;
                                    text7.text = " : تاریخ";
                                    rect3.addControl(text7);
                                    input4 = new GUI.InputText();
                                    input4.maxWidth = "550px";
                                    input4.height = "100px";
                                    input4.color = "black";
                                    input4.topInPixels = 150;
                                    input4.leftInPixels = -150
                                    input4.background = "orange";
                                    input4.placeholderText = "format : 1402-4-15";
                                    input4.focusedBackground = "orange";
                                    input4.placeholderColor = "black";
                                    input4.autoStretchWidth = true;
                                    input4.fontSize = 45;
                                    rect3.addControl(input4);
                                    rect4.topInPixels = 280;
                                    text8.text = "ذخیره";
                                } else {
                                    text7.dispose();
                                    input4.dispose();
                                    input4 = undefined;
                                    rect4.topInPixels = 150;
                                    text8.text = "ذخیره برای فردا";
                                }
                            });
                        rect3.addControl(checkbox);
                        let text6 = new GUI.TextBlock();
                        text6.height = "100px";
                        text6.width = "370px"
                        text6.topInPixels = 20;
                        text6.leftInPixels = -50;
                        text6.color = "black";
                        text6.fontSize = 50;
                        text6.text = "انتخاب روز مشخص";
                        rect3.addControl(text6);
                        // **** پایان نمایش فرم کار جدید روی برد **** **** شروع ایجاد اونت کیبورد حرکت
                        // کاراکتر ****
                        scene.actionManager = new ActionManager(scene);
                        scene
                            .actionManager
                            .registerAction(new ExecuteCodeAction({
                                trigger: ActionManager.OnKeyDownTrigger,
                                parameter: function (actionEvent) {
                                    if (actionEvent.sourceEvent.key === 'w') {
                                        inputMap['w'] = true;
                                    }
                                    if (actionEvent.sourceEvent.key === 'a') {
                                        inputMap['a'] = true;
                                    }
                                    if (actionEvent.sourceEvent.key === 'd') {
                                        inputMap['d'] = true;
                                    }
                                    if (actionEvent.sourceEvent.key === 's') {
                                        inputMap['s'] = true;
                                    }
                                }
                            }));
                        scene
                            .actionManager
                            .registerAction(new ExecuteCodeAction({
                                trigger: ActionManager.OnKeyUpTrigger,
                                parameter: function (actionEvent) {
                                    if (actionEvent.sourceEvent.key === 'w') {
                                        inputMap['w'] = false;
                                        walkingAnim.stop();
                                        standingAnim.start(true, 0.1, walkingAnim.from, walkingAnim.to, false);
                                    }
                                    if (actionEvent.sourceEvent.key === 'a') {
                                        inputMap['a'] = false;
                                    }
                                    if (actionEvent.sourceEvent.key === 'd') {
                                        inputMap['d'] = false;
                                    }
                                    if (actionEvent.sourceEvent.key === 's') {
                                        inputMap['s'] = false;
                                        walkingAnim.stop();
                                        standingAnim.start(true, 0.1, walkingAnim.from, walkingAnim.to, false);
                                    }
                                }
                            }));
                        // **** پایان ایجاد اونت کیبورد حرکت کاراکتر ****
                        let collisionCheckArray = [
                            scene.getMeshByName("charcol"),
                            scene.getMeshByName("wall1"),
                            scene.getMeshByName("wall2"),
                            scene.getMeshByName("wall3"),
                            scene.getMeshByName("wall4"),
                            scene.getMeshByName("ontable")
                        ];
                        let wOrS = '';
                        let cameraAlphaSaver = camera.alpha;
                        let cameraBetaSaver = camera.beta;
                        scene
                            .onBeforeRenderObservable
                            .add(() => {
                                if (inputMap['w']) {
                                    character.movePOV(0, 0, 0.035);
                                    wOrS = 'w';
                                    camera.setTarget(
                                        new Vector3(character.position.x, character.position.y + 2, character.position.z)
                                    );
                                    camera.beta = cameraBetaSaver;
                                    standingAnim.stop();
                                    walkingAnim.start(true, 1.0, walkingAnim.from, walkingAnim.to, false);

                                }
                                if (inputMap['a']) {
                                    cameraAlpha = cameraAlpha + (Math.PI / 100);
                                    camera.alpha = cameraAlpha;
                                }
                                if (inputMap['d']) {
                                    cameraAlpha = cameraAlpha + ((Math.PI / 100) * -1);
                                    camera.alpha = cameraAlpha;
                                }
                                if (inputMap['s']) {
                                    character.movePOV(0, 0, -0.035);
                                    wOrS = 's';
                                    camera.setTarget(
                                        new Vector3(character.position.x, character.position.y + 2, character.position.z)
                                    );
                                    camera.beta = cameraBetaSaver;
                                    standingAnim.stop();
                                    walkingAnim.start(true, 1.0, walkingAnim.to, walkingAnim.from, false);
                                }
                                if (camera.beta > Math.PI / 2) {
                                    camera.beta = Math.PI / 2;
                                }
                                if (!(camera.radius == 2)) {
                                    camera.radius = 2;
                                }
                                if (camera.alpha != cameraAlphaSaver) {
                                    character.rotate(new Vector3(0, 1, 0), (cameraAlphaSaver - camera.alpha));
                                    cameraAlphaSaver = camera.alpha;
                                    cameraAlpha = camera.alpha;
                                }
                                if (camera.beta != cameraBetaSaver) {
                                    cameraBetaSaver = camera.beta;
                                }
                                if (wOrS == 'w') {
                                    for (let im = 1; im < 6; im++) {
                                        if (collisionCheckArray[0].intersectsMesh(collisionCheckArray[im])) {
                                            character.movePOV(0, 0, -0.07);
                                        }
                                    }
                                } else if (wOrS == "s") {
                                    for (let im = 1; im < 6; im++) {
                                        if (collisionCheckArray[0].intersectsMesh(collisionCheckArray[im])) {
                                            character.movePOV(0, 0, 0.07);
                                        }
                                    }
                                }
                            });
                        engine.hideLoadingUI();
                    })
            })
    }
    // **** پایان بارگذاری صحنه بازی ****

    const onRender = (scene) => {};
    return (
        <div>
            <SceneComponent
                style={{
                    width: "100%",
                    height: "100vh"
                }}
                antialias="antialias"
                onSceneReady={onSceneReady}
                onRender={onRender}
                id="my-canvas"/>
        </div>
    );
}