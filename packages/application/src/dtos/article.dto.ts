export interface ArticleDto {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    publishedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
