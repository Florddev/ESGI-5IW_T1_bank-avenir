export interface ArticleProps {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    publishedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export class Article {
    private constructor(private readonly props: ArticleProps) {}

    static create(
        authorId: string,
        authorName: string,
        title: string,
        content: string
    ): Article {
        const now = new Date();
        return new Article({
            id: crypto.randomUUID(),
            title,
            content,
            authorId,
            authorName,
            publishedAt: now,
            createdAt: now,
            updatedAt: now,
        });
    }

    static fromPersistence(props: ArticleProps): Article {
        return new Article(props);
    }

    get id(): string {
        return this.props.id;
    }

    get title(): string {
        return this.props.title;
    }

    get content(): string {
        return this.props.content;
    }

    get authorId(): string {
        return this.props.authorId;
    }

    get authorName(): string {
        return this.props.authorName;
    }

    get publishedAt(): Date {
        return this.props.publishedAt;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
