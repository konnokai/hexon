<script setup lang="ts">
import { useEventListener } from "@vueuse/core"
import { computed, onBeforeUnmount, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import dayjs, { Dayjs } from "dayjs"
import { PostOrPage } from "~/interface"
import { useDialog } from "~/lib/dialog"
import { useDetailStore } from "~/store/detail"
import { useDispatcher } from "~/store/dispatcher"
import { useMainStore } from "~/store/main"
import { useSettingsStore } from "~/store/settings"
import { noop, useAsyncComponentWithLoading } from "~/utils"
import { parseHfm, updateStringByObj } from "~/utils/hfm"
import ErroredView from "~/views/ErroredView.vue"
import { HEditorToolbarActionPayload } from "@/types"
import { HButton } from "@/ui/button"
import { HIcon, HIconName } from "@/ui/icon"
import { HLoading } from "@/ui/loading"
import { useThemeVars } from "@/ui/theme"
import HEditorToolbar from "@/HEditorToolbar.vue"
import HTitle from "@/HTitle.vue"
import HCategoriesEditor from "@/editors/HCategoriesEditor.vue"
import HDateEditor from "@/editors/HDateEditor.vue"
import HFrontmatterEditor from "@/editors/HFrontmatterEditor.vue"
import HHeaderEditor from "@/editors/HHeaderEditor.vue"
import HLayoutEditor from "@/editors/HLayoutEditor.vue"
import HTagEditor from "@/editors/HTagEditor.vue"
import HNavTitle from "@/ui/nav-list/src/HNavTitle.vue"
import { DATE_FORMAT } from "~/constants";

const [HMonacoEditor, monacoLoading] = useAsyncComponentWithLoading(
  () => import("@/editors/HMonacoEditor.vue")
)

//#region hooks
const route = useRoute()
const router = useRouter()
const dispatcher = useDispatcher()
const detailStore = useDetailStore()
const mainStore = useMainStore()
const dialog = useDialog()
const settingsStore = useSettingsStore()
const vars = useThemeVars()
const props = defineProps<{
  type: PostOrPage
  source: string
}>()
//#endregion

//#region handlers
const onHome = () => {
  router.push("/")
}
const onAction = (payload: HEditorToolbarActionPayload) => {
  const { type, source } = props
  switch (payload.type) {
    case "back":
      changed.value
        ? dialog.create({
            type: "warning",
            title: "有未儲存的更改",
            content: "確定要離開麼？",
            actions: [
              { label: "再想想", type: "common" },
              {
                label: "是的",
                type: "error",
                run: () => {
                  dispatcher.viewArticle({ type, source })
                },
              },
            ],
          })
        : dispatcher.viewArticle({ type, source })
      break
    case "save":
      dispatcher.saveArticle(internal_raw.value).then(setUnchanged, noop)
      break
    case "delete":
      dispatcher.deleteArticle({ type, source })
      break
    case "publish":
      dispatcher.publishArticle(source)
      break
    default:
      break
  }
}

const onSave = () => {
  onAction({
    type: "save",
  })
}
useEventListener("beforeunload", (e) => {
  if (!changed.value) return
  if (!confirm("確定離開？你所做的更改可能未儲存。")) {
    e.preventDefault()
    e.returnValue = ""
  }
})
//#endregion

//#region data
function load() {
  const { type, source } = props
  if (type === "post" || type === "page") {
    dispatcher.getArticle({ type, source })
  } else {
    dispatcher.goHome()
  }
}
onBeforeUnmount(() => {
  dispatcher.clearArticle()
})
watch(
  () => route.fullPath,
  () => {
    if (route.name !== "edit") return
    load()
    dispatcher.loadBlogData()
  },
  {
    immediate: true,
  }
)
const raw = computed(() => detailStore.article?.raw ?? "")
const internal_raw = ref(raw.value)
watch(raw, (v) => (internal_raw.value = v))
const data = computed(() => parseHfm(internal_raw.value))
const content = computed(() => data.value._content)
const title = computed(() => data.value.title)
const layout = computed(() => data.value.layout)
const tags = computed(() => data.value.tags)
const categories = computed(() => data.value.categories)
const date = computed(() => {
  const res = dayjs(data.value.date)
  if (res.format("") === "Invalid Date") return null
  return res
})
const updated = computed(() => {
  const res = dayjs(data.value.updated)
  if (res.format("") === "Invalid Date") return null
  return res
})
const fm = computed(() => data.value.fm)
const availableTags = computed(() => mainStore.tagNamesList)
const availableCats = computed(() => mainStore.catNamesList)
//#endregion

//#region update
const changed = ref(false)
const setChanged = () => (changed.value = true)
const setUnchanged = () => (changed.value = false)
const updateFromObj = (obj: any) => {
  internal_raw.value = updateStringByObj(internal_raw.value, obj)
  setChanged()
}
const updateTitle = (title: string = "") => {
  updateFromObj({ title })
}
const updateContent = (_content: string) => {
  updateFromObj({ _content })
}
const updateTags = (tags: string[] = []) => {
  updateFromObj({ tags })
}
const updateCategories = (categories: string[] = []) => {
  updateFromObj({ categories })
}
const updateLayout = (layout: string = "") => {
  updateFromObj({ layout })
}
const updateDate = (date: Dayjs | null) => {
  updateFromObj({ date: date?.format(DATE_FORMAT) })
}
const updateUpdated = (updated: Dayjs | null) => {
  updateFromObj({ updated: updated?.format(DATE_FORMAT) })
}
const updateFm = (fm: { [key: string]: unknown }) => {
  updateFromObj({ fm })
}
//#endregion
</script>
<template>
  <HLoading :loading="detailStore.isLoading">
    <ErroredView v-if="detailStore.error">
      <div>
        <HButton inverted @click="onHome">回首頁</HButton>
        <HButton class="ml-2" @click="load">重試</HButton>
      </div>
    </ErroredView>
    <div class="flex h-full w-full overflow-hidden" v-else>
      <div
        class="main flex-1 min-w-0 flex flex-col h-full"
        :style="{ backgroundColor: vars.backgroundColorPrimary }"
      >
        <HEditorToolbar
          :saving="detailStore.saving"
          :changed="changed"
          @on-action="onAction"
        />
        <div class="flex flex-col flex-1 w-full min-h-0 max-w-2xl mx-auto">
          <HHeaderEditor :value="title" @update:value="updateTitle" />
          <div class="flex-1 w-full relative">
            <HLoading :loading="monacoLoading" overlay>
              <HMonacoEditor
                class="h-full w-full"
                id="default"
                :font-family="settingsStore.settings.ui.editor.fontFamily"
                :value="content"
                @update:value="updateContent"
                @on-save="onSave"
              />
            </HLoading>
          </div>
        </div>
      </div>
      <div
        class="side w-72 h-full flex flex-col"
        :style="{ backgroundColor: vars.backgroundColorTertiary }"
      >
        <HTitle>
          <div class="px-5">Frontmatters</div>
        </HTitle>
        <div class="flex-1 h-0 overflow-auto pt-2 pb-4">
          <HNavTitle>
            <HIcon :name="HIconName.Globe" class="mr-1" />
            發布於
          </HNavTitle>
          <HDateEditor :date="date" @update:date="updateDate" />
          <HNavTitle class="mt-2">
            <HIcon :name="HIconName.DevUpdate" class="mr-1" />
            更新於
          </HNavTitle>
          <HDateEditor :date="updated" @update:date="updateUpdated" />
          <HNavTitle class="mt-2">
            <HIcon :name="HIconName.Tag" class="mr-1" />
            標籤
          </HNavTitle>
          <HTagEditor
            :available-tags="availableTags"
            :tags="tags"
            @update:tags="updateTags"
          />
          <HNavTitle class="mt-2">
            <HIcon :name="HIconName.Folder" class="mr-1" />
            分類
          </HNavTitle>
          <HCategoriesEditor
            :availableCats="availableCats"
            :categories="categories"
            @update:categories="updateCategories"
          />
          <HNavTitle class="mt-2">
            <HIcon :name="HIconName.Type" class="mr-1" />
            Layout
          </HNavTitle>
          <HLayoutEditor :layout="layout" @update:layout="updateLayout" />
          <HNavTitle class="mt-2">
            <HIcon :name="HIconName.HolePunchLandscapeTop" class="mr-1" />
            Front-matter
          </HNavTitle>
          <HFrontmatterEditor :fm="fm" @update:fm="updateFm" />
        </div>
      </div>
    </div>
  </HLoading>
</template>
<route>
{
  name: "edit",
}
</route>
