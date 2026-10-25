import styles from "./PsychologyGrid.module.css";

import PsychologyCard from "../PsychologyCard/PsychologyCard";

import { PsychologyPost } from "../PsychologySection/PsychologySection";

interface Props {

    posts: PsychologyPost[];

}

export default function PsychologyGrid({
                                           posts,
                                       }: Props) {

    if (!posts.length) {

        return (

            <div className={styles.empty}>

                <div className={styles.emptyIcon}>
                    🧠
                </div>

                <h3>
                    Матеріалів поки немає
                </h3>

                <p>
                    Нові публікації психолога з'являться тут.
                </p>

            </div>

        );

    }

    return (

        <div className={styles.grid}>

            {posts.map(post => (

                <PsychologyCard
                    key={post.id}
                    post={post}
                />

            ))}

        </div>

    );

}