(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[8],{"8e7f":function(e,o,t){"use strict";t.r(o);var r=function(){var e=this,o=e.$createElement,t=e._self._c||o;return t("div",{ref:"monaco-editor",staticClass:"overflow-hidden"})},i=[],n=(t("c36f"),t("7c3e"),t("fd11"),t("aee8"),t("1af3"),t("747f"),t("d844"),t("f17c"),t("5ed2"),t("a106"),t("33f9")),d=(t("2cd0"),t("4576")),a={base:"vs",inherit:!0,rules:[{foreground:"999999",token:"comment"},{foreground:"999999",token:"string.md"},{foreground:"bbbbbb",token:"string.link.md"},{foreground:"0e83cd",token:"keyword"},{foreground:"0e83cd",fontStyle:"bold",token:"variable.md"}],colors:{"editor.foreground":"#333333","editor.background":"#ffffff","editorCursor.foreground":"#0e83cd","editor.lineHighlightBackground":"#00000005","editor.selectionBackground":"#00000020"}},s={base:"vs-dark",inherit:!0,rules:[{foreground:"999999",token:"comment"},{foreground:"999999",token:"string.md"},{foreground:"666666",token:"string.link.md"},{foreground:"0e83cd",token:"keyword"},{foreground:"0e83cd",fontStyle:"bold",token:"variable.md"}],colors:{"editor.foreground":"#bdbdbd","editor.background":"#323232","editorCursor.foreground":"#0e83cd","editor.lineHighlightBackground":"#00000005","editor.selectionBackground":"#00000040"}};function u(e){return e?"myTheme":"myThemeDark"}var c={name:"MonacoEditor",props:{value:String},data(){return{rect:{width:0,height:0}}},watch:{value(e){this.editor.getValue()!==e&&this.editor.setValue(e)},dark(e){n["editor"].setTheme(u(e))}},methods:{layout(){this.editor.layout()}},computed:{dark(){return this.$q.dark.isActive},style(){return`width:${this.rect.width}px;height:${this.rect.height}px`}},mounted(){const e=this.$refs["monaco-editor"];n["editor"].defineTheme(u(!1),a),n["editor"].defineTheme(u(!0),s);const o={value:this.value,language:"markdown",theme:u(this.$q.dark.isActive),folding:!1,readOnly:!1,roundedSelection:!0,renderIndentGuides:!1,minimap:{enabled:!1},occurrencesHighlight:!1,wordBasedSuggestions:!1,highlightActiveIndentGuide:!1,hideCursorInOverviewRuler:!0,automaticLayout:!0,overviewRulerBorder:!1,renderLineHighlight:"none",scrollbar:{vertical:"hidden",horizontal:"hidden",verticalScrollbarSize:6,useShadows:!1},fontSize:14,lineHeight:18,wordWrap:"on",lineNumbers:"off",cursorBlinking:"smooth",fontFamily:"PingFang SC,-apple-system,SF UI Text,Lucida Grande,STheiti,Microsoft YaHei,sans-serif",contextmenu:!1};this.editor=n["editor"].create(e,o),this.editor.onDidChangeModelContent((()=>{const e=this.editor.getValue();this.value!==e&&this.$emit("input",e)}));const t=new d["MonacoMarkdownExtension"];t.activate(this.editor)},beforeDestroy(){this.editor.dispose()}},l=c,h=(t("b8fb"),t("2877")),f=Object(h["a"])(l,r,i,!1,null,null,null);o["default"]=f.exports},a5e0:function(e,o,t){},b8fb:function(e,o,t){"use strict";t("a5e0")}}]);