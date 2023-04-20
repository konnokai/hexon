import { defineStore } from "pinia"
import { defineAsyncComponent } from "vue"
import { ICreateOptions } from "~/api"
import { changePassword, getInfo, login, changeUsername } from "~/api/auth"
import { IChangePasswordFormPayload } from "~/components/forms/interface"
import { getErrorId, getErrorMessage } from "~/errors"
import { IArticleIdentifier } from "~/interface"
import { isPost } from "~/utils/article"
import { useDetailStore } from "./detail"
import { useMainStore } from "./main"
import { useSettingsStore } from "./settings"

const HCreateArticleModal = defineAsyncComponent(
  () => import("@/modals/HCreateArticleModal.vue")
)
const HSettingsModal = defineAsyncComponent(
  () => import("@/modals/HSettingsModal.vue")
)

export const useDispatcher = defineStore("dispatcher", {
  state: () => ({}),
  actions: {
    init() {
      const mainStore = useMainStore()
      mainStore.loadUsername()
    },
    //#region user
    async getInfo() {
      return Promise.all([this.getUsername(), this.getSettings()])
    },
    async getSettings() {
      const settingsStore = useSettingsStore()
      await settingsStore.load()
    },
    async getUsername() {
      const mainStore = useMainStore()
      const { username } = await getInfo()
      mainStore.setUsername(username)
    },
    async signIn({
      username,
      password,
      totp
    }: {
      username: string
      password: string
      totp: string
    }) {
      try {
        await login(username, password, totp)
        this.getInfo()
        this.router.push({ name: "home" })
      } catch (e) {
        this.notification.notify({
          title: "登陆失败",
          type: "error",
        })
      }
    },
    async changePassword(payload: IChangePasswordFormPayload) {
      return changePassword(payload.oldPassword, payload.newPassword).then(
        () => {
          this.notification.notify({ type: "success", title: "密码修改成功" })
        },
        (err) => {
          this.notification.notify({
            title: "密码修改失败",
            desc: (err as Error).message,
            type: "error",
            duration: 5000,
          })
        }
      )
    },
    async changeUsername(username: string) {
      return changeUsername(username).then(
        () => {
          this.notification.notify({ type: "success", title: "用户名修改成功" })
          return this.getUsername()
        },
        (err) => {
          this.notification.notify({
            title: "用户名修改失败",
            desc: (err as Error).message,
            type: "error",
            duration: 5000,
          })
        }
      )
    },
    //#endregion
    //#region modals
    showCreateArticleModal() {
      this.modal.create(HCreateArticleModal)
    },
    showSettingsModal() {
      this.modal.create(HSettingsModal)
    },
    //#endregion
    async createArticle(title: string, options: ICreateOptions) {
      const mainStore = useMainStore()
      this.loading.start()
      try {
        await mainStore.createArticle(title, options).then(
          () => {
            this.notification.notify({
              type: "success",
              title: "新建成功",
            })
          },
          (err) => {
            this.notification.notify({
              title: "新建失败",
              desc: (err as Error).message,
              type: "error",
              duration: 5000,
            })
          }
        )
      } catch (err) {
      } finally {
        this.loading.stop()
      }
    },
    deleteArticle(id: IArticleIdentifier) {
      const mainStore = useMainStore()
      this.dialog.create({
        type: "warning",
        title: "删除确认",
        content: "删除后需手动恢复",
        actions: [
          { type: "common", label: "取消" },
          {
            type: "error",
            label: "删除",
            run: () => {
              mainStore.deleteArticle(id.type, id.source).then(() => {
                this.notification.notify({
                  type: "success",
                  title: "删除成功",
                })
                // FIXME 不是每次都要跳转
                this.router.push({ name: "home" })
              })
            },
          },
        ],
      })
    },
    async saveArticle(raw: string) {
      this.loading.start()
      try {
        const detailStore = useDetailStore()
        await detailStore.saveArticle(raw).then(
          () => {
            this.notification.notify({
              title: "保存成功",
              type: "success",
            })
            this.reloadBlogData()
          },
          (err) => {
            this.notification.notify({
              title: "文章保存失败",
              desc: (err as Error).message,
              type: "error",
              duration: 5000,
            })
            throw err
          }
        )
      } catch (err) {
      } finally {
        this.loading.stop()
      }
    },
    editArticle(id: IArticleIdentifier) {
      this.router.push({ name: "edit", params: { ...id } })
    },
    viewArticle(id: IArticleIdentifier) {
      this.router.push({ name: "view", params: { ...id } })
    },
    getArticle(id: IArticleIdentifier) {
      const detailStore = useDetailStore()
      detailStore.getArticle(id.type, id.source).catch((err) => {
        if (getErrorId(err) === "PostOrPageNotFoundError") {
          this.goHome()
        } else {
          this.notification.notify({
            title: "文章载入失败",
            desc: getErrorMessage(err),
            type: "error",
            duration: 5000,
          })
        }
      })
    },
    clearArticle() {
      const detailStore = useDetailStore()
      detailStore.clearArticle()
    },
    async publishArticle(source: string) {
      this.dialog.create({
        type: "warning",
        title: "发布确认",
        content: "发布后需手动恢复",
        actions: [
          { type: "common", label: "取消" },
          {
            type: "info",
            label: "发布",
            run: () => {
              this.doPublishArticle(source)
            },
          },
        ],
      })
    },
    async doPublishArticle(source: string) {
      const prefix = "_drafts/"
      if (!source.startsWith(prefix)) return
      this.loading.start()
      try {
        const removePrefixAndExt = (source: string) => {
          return source.slice(prefix.length, -3)
        }
        const mainStore = useMainStore()
        await mainStore.publishArticle(removePrefixAndExt(source)).then(
          (article) => {
            this.notification.notify({
              title: "发布成功",
              type: "success",
            })
            const detailStore = useDetailStore()
            if (
              detailStore.article &&
              isPost(detailStore.article) &&
              detailStore.article.source === source
            ) {
              this.router.push({
                name: "view",
                params: { source: article.source },
              })
            }
          },
          (err) => {
            this.notification.notify({
              title: "文章发布失败",
              desc: (err as Error).message,
              type: "error",
              duration: 5000,
            })
          }
        )
      } catch (err) {
      } finally {
        this.loading.stop()
      }
    },
    goHome() {
      this.router.push({ name: "home" })
    },
    reloadBlogData() {
      const mainStore = useMainStore()
      mainStore.getBlogData().catch((err) => {
        this.notification.notify({
          title: `博客数据刷新失败`,
          desc: (err as Error).message,
          type: "error",
          actions: [
            {
              label: "重试",
              run: () => {
                this.reloadBlogData()
              },
            },
          ],
        })
      })
    },
    loadBlogData() {
      const mainStore = useMainStore()
      mainStore.getBlogData().catch((err) => {
        this.notification.notify({
          title: `博客数据载入失败`,
          desc: (err as Error).message,
          type: "error",
          duration: 5000,
        })
      })
    },
  },
})
