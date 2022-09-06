export interface UserMeta {
	userId: number
	schoolId: number
	userName?: string
	schoolName?: string
	avatar?: string
	roles?: string
}

export interface Quotation {
	id: number
	source: string
	content: string
}