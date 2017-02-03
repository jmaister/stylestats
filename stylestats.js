"use strict";

function savestats(node, stats) {
    stat_node_num(node, stats);
    stat_class_num(node, stats);
    stat_style_num(node, stats);
    stat_node_style_num(node, stats);
}

// Node number
function stat_node_num(node, stats) {
    let nodeName = node.nodeName;
    inc(stats.nodes, nodeName);
}

// Class number
function stat_class_num(node, stats) {
    let classList = node.classList;
    if (classList) {
        for (let i = 0; i < classList.length; i++) {
            let classname = classList[i];
            inc(stats.classes, classname);
        }
    } else {
        inc(stats.classes, 'NO_CLASS');
    }
}

// Style number
function stat_style_num(node, stats) {
    let nodeName = node.nodeName;
    let style = node.style;
    if (style && style.length > 0) {
        inc(stats.styles, nodeName);
    } else {
        inc(stats.styles, 'NO_STYLE');
    }
}

// Style number
function stat_node_style_num(node, stats) {
    let nodeName = node.nodeName;
    let style = node.style;
    if (style) {
        for (let i=0; i < style.length; i++) {
            let key = nodeName + " + " + style[i];
            inc(stats.nodestyles, key);
        }
    } else {
        inc(stats.nodestyles, 'NO_STYLE');
    }
}

function inc(dict, key) {
    let value = dict[key];
    if (value) {
        dict[key] = value + 1;
    } else {
        dict[key] = 1;
    }
}

function traverse(node, stats) {
    savestats(node, stats);

    let childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
        traverse(childNodes[i], stats);
    }
}

function clean(stats) {
    delete stats.nodes['#text'];
    delete stats.nodes['#comment'];
    delete stats.nodes['#document'];

    if (stats.classes.NO_CLASS) {
        delete stats.classes.NO_CLASS;
    }

    if (stats.styles.NO_STYLE) {
        delete stats.styles.NO_STYLE;
    }

    if (stats.nodestyles.NO_STYLE) {
        delete stats.nodestyles.NO_STYLE;
    }
}

function runstats(startNode) {
    let stats = {
        nodes: {},
        classes: {},
        styles: {},
        nodestyles: {}
    };
    console.log("Running StyleStats");
    traverse(startNode, stats);
    clean(stats);
    return stats;
}

document.addEventListener("DOMContentLoaded", function () {
    let data = runstats(window.document);

    let ipcRenderer = require('electron').ipcRenderer;
    ipcRenderer.sendToHost("stats", data);
});
