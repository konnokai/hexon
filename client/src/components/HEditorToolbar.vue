<script setup lang="ts">
import { useDetailStore } from "~/store/detail"
import { HBadge } from "@/ui/badge"
import { HButton } from "@/ui/button"
import { HIcon } from "@/ui/icon"
import { HIconName } from "@/ui/icon"
import { useThemeVars } from "@/ui/theme"
import { HEditorToolbarActionPayload } from "./types"
import HToolbar from "./HToolbar.vue"
const props = defineProps<{
  saving?: boolean
  changed?: boolean
}>()
const emits = defineEmits<{
  (e: "on-action", payload: HEditorToolbarActionPayload): void
}>()
const vars = useThemeVars()
const detailStore = useDetailStore()
</script>
<template>
  <HToolbar class="px-2">
    <HButton size="small" @click="emits('on-action', { type: 'back' })">
      返回
    </HButton>
    <div class="flex-1"></div>
    <HBadge class="mr-2" v-if="props.saving" rounded>儲存中...</HBadge>
    <template v-else>
      <HBadge
        class="mr-2"
        :bg-color="vars.colorCommon"
        v-if="props.changed"
        rounded
      >
        未儲存
      </HBadge>
    </template>
    <HButton
      class="mr-2"
      type="primary"
      round
      inverted
      @click="emits('on-action', { type: 'save' })"
    >
      <HIcon :name="HIconName.Save" />
    </HButton>
    <HButton
      class="mr-2"
      type="error"
      round
      inverted
      @click="emits('on-action', { type: 'delete' })"
    >
      <HIcon :name="HIconName.Delete" />
    </HButton>
    <HButton
      class="mr-2"
      type="success"
      round
      inverted
      @click="emits('on-action', { type: 'publish' })"
      v-if="detailStore.isDraft"
    >
      <HIcon :name="HIconName.Upload" />
    </HButton>
  </HToolbar>
</template>
