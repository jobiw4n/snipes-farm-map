map.on('load', () => {
    map.addSource('places', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'title': 'Bee Hives',
                        'description':
                            'This is where the bees make Honey!',
                            'imageLink':'https://ourdailyhomestead.com/wp-content/uploads/2020/06/how-to-start-a-beehive-with-wild-bees-1024x683.jpg'
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [-74.7982367, 40.1994422]
                    }
                }//,
                // {
                //     'type': 'Feature',
                //     'properties': {
                //         'description':
                //             '<strong>Mad Men Season Five Finale Watch Party</strong><p>Head to Lounge 201 (201 Massachusetts Avenue NE) Sunday for a Mad Men Season Five Finale Watch Party, complete with 60s costume contest, Mad Men trivia, and retro food and drink. 8:00-11:00 p.m. $10 general admission, $20 admission and two hour open bar.</p>'
                //     },
                //     'geometry': {
                //         'type': 'Point',
                //         'coordinates': [-74.796837, 40.2004326]
                //     }
                // }
            ]
        }
    });
    // Add a layer showing the places.
    map.addLayer({
        'id': 'places',
        'type': 'circle',
        'source': 'places',
        'paint': {
            'circle-color': '#4264fb',
            'circle-radius': 6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
        }
    });

    // Create a popup, but don't add it to the map yet.
    var placePopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'places', (e) => {
        popup.remove();
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const title = `<h3>${e.features[0].properties.title}</h3>`;
        const image = `<img src='${e.features[0].properties.imageLink}'></img>`
        const description = `<p>${e.features[0].properties.description}</p>`;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        placePopup.setLngLat(coordinates).setHTML(title).addTo(map);
    });

    map.on('mouseleave', 'places', () => {
        map.getCanvas().style.cursor = '';
        placePopup.remove();
    });

    map.on('click', (event) => {
        placePopup.remove()
        // If the user clicked on one of your markers, get its information.
        const features = map.queryRenderedFeatures(event.point, {
          layers: ['places'] // replace with your layer name
        });
        if (!features.length) {
          return;
        }
      const feature = features[0];

            /* 
          Create a popup, specify its options 
          and properties, and add it to the map.
        */

          const title = `<h3>${feature.properties.title}</h3>`;
          const image = `<div style='text-align:center'><img width=150 src='${feature.properties.imageLink}'></img><div>`
          const description = `<p>${feature.properties.description}</p>`;
      
      placePopup = new mapboxgl.Popup({ offset: [0, -5] })
        .setLngLat(event.lngLat)
        .setHTML(title+image+description)
        .addTo(map);

        popup.remove()
    })
});
