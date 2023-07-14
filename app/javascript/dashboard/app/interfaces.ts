export interface UserMetadata {
    id: number,
    name: string,
    email: string,
    image_url: string,
}
export interface UserInformation extends UserMetadata {
    created_at: string,
    updated_at: string,
    auth_token: string
}
export interface DocumentContents {
    title: string,
    sub_title?: string,
    content: string,
    banner_link?: string,
    no_banner?: boolean,
    breadcrumbs?: any[]
}
export interface ProjectMetadata {
    id: number,
    user_id: number,
    title: string,
    desc: string,
    created_at: string,
    updated_at: string,
    status: number,
    image_url: string,
    slide_count: number
}
export interface ProjectMetadataList {
    project_count: number,
    projects: ProjectMetadata[]
}
export interface SlideTemplate {
    backgroundImageUrl: string,
    title?: string
}
export interface Slide {
    template: SlideTemplate,
    header: string,
    body: string
}
export interface ProjectData extends ProjectMetadata {
    slides: Slide[],
    statusInfo: string,
    collaborators: UserMetadata[]
}
export interface SidebarStatus {
    active: boolean,
    collapsed: boolean
}
