export interface UserInformation {
    id: number,
    name: string,
    email: string,
    created_at: string,
    updated_at: string,
    image_url: string,
    auth_token: string
}
export interface DocumentContents {
    title: string,
    sub_title?: string,
    content: string,
    banner_link?: string
}
export interface ProjectMetadata {
    id: number,
    user_id: number,
    title: string,
    desc: string,
    created_at: string,
    updated_at: string,
    status: number,
    slide_count: number
}
export interface ProjectMetadataList {
    project_count: number,
    projects: ProjectMetadata[]
}
