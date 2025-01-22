import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
    {
    title: 'C/C++',
    Svg: require('@site/static/img/cpp.svg').default,
    // description: (
    //   <>
    //     Docusaurus 让你专注于你的文档，我们会处理杂务。请把文档<code>docs</code>移到文档目录中。
    //   </>
    // ),
    },
    {
        title: 'SLAM',
        Svg: require('@site/static/img/SLAM.svg').default,
        // description: (
        //   <>
        //     Docusaurus 是从头开始设计的，易于安装和使用，可以快速启动您的网站。
        //   </>
        // ),
    },

    {
        title: '单片机',
        Svg: require('@site/static/img/MCU.svg').default,
        // description: (
        //   <>
        //     通过重用React来扩展或自定义您的网站布局。Docusaurus可以在重用相同的标题和脚注时进行扩展。
        //   </>
        // ),
    },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
