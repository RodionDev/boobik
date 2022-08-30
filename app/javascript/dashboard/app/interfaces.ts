export interface UserInformation {
    name: string,
    image_url: string,
    user_id: number
}
export interface DocumentContents {
    title: string,
    sub_title?: string,
    content: string
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
export interface ProjectContents {
}
